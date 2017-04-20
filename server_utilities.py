from flask import Flask, jsonify
from flask_cache import Cache
from shapely.geometry import shape, Point

app = Flask(__name__)

# data caching from API
cache = Cache(app,config={'CACHE_TYPE': 'simple'})

import os           # Access OS environment variables
import requests     # HTTP requests to Socrata API endpoints

# get SF DATA app token 
sf_data = os.environ["SF_DATA_APP_TOKEN"]

################################################################################
# Cached data

@cache.cached(timeout=3600, key_prefix="truck_data_cached")
def get_truck_data_cached():
    """Get food truck data from API and cache for 1 hour."""

    url = "https://data.sfgov.org/resource/6a9r-agq8.json?$$app_token=" + sf_data
    response = requests.get(url)
    if response.status_code == 200:
        trucks = response.json()
    return trucks


@cache.cached(timeout=3600, key_prefix="popos_data_cached")
def get_popos_data_cached():
    """Get POPOS data from API and cache for 1 hour."""

    url = "https://data.sfgov.org/resource/3ub7-d4yy.json?$$app_token=" + sf_data
    response = requests.get(url)
    if response.status_code == 200:
        popos = response.json()
    return popos


@cache.cached(timeout=3600, key_prefix="art_data_cached")
def get_art_data_cached():
    """Get art data from API and cache for 1 hour."""

    url = "https://data.sfgov.org/resource/8fe8-yww8.json?$$app_token=" + sf_data
    response = requests.get(url)
    if response.status_code == 200:
        art = response.json()
    return art


@cache.cached(timeout=3600, key_prefix="hood_data_cached")
def get_hood_data_cached():
    """Get neighborhood data from API and cache for 1 hour."""

    url = "https://data.sfgov.org/resource/6ia5-2f8k.json?$$app_token=" + sf_data
    response = requests.get(url)
    if response.status_code == 200:
        hoods = response.json()
    return hoods


################################################################################
# page display

def display_trucks():
    trucks = get_truck_data_cached()
    total_trucks = len(trucks)
    truck_dict = {}

    for letter in "abcdefghijklmnopqrstuvwxyz":
        truck_dict[letter] = []

    for truck in trucks:
        if "applicant" in truck:
            alpha = truck["applicant"].lstrip("\"'1234567890")[0].lower()
        else:
            alpha = "u"
        truck_dict[alpha].append(truck)

    # sort lists so each letter is alphabetized
    for letter, trucks in truck_dict.items():
        trucks.sort(key=lambda truck: truck["applicant"])

    for letter, trucks in truck_dict.items():     
        previous_truck = None
        locations = []
        display_trucks = []

        if trucks:        
            for truck in trucks:
                # add location if no previous truck or matches previous truck
                if (previous_truck is None or 
                truck["applicant"] == previous_truck["applicant"]):
                    locations.append(truck)
                else:
                    # add locations to previous truck with list of all locations
                    previous_truck["locations"] = locations
                    # add the one previous truck with all locations to new list
                    display_trucks.append(previous_truck)
                    # put current unmatching truck in locations
                    locations = [truck]
                previous_truck = truck

        truck_dict[letter] = display_trucks

    return (total_trucks, truck_dict)



def display_popos():
    popos = get_popos_data_cached()
    total_popos = len(popos)
    popos_types = ["atrium", "greenhouse", "indoorpark", "lobby", "plaza",
        "pedestrian", "sittingarea", "snippet", "sunterrace", "garden",
        "urbanpark", "viewterrace", "other"]
    popos_dict = {}

    for popos_type in popos_types:
        popos_dict[popos_type] = []

    for popo in popos:
        if "type" in popo:
            this_type = str(popo["type"].lower()).replace(" ", "")
            for popos_type in popos_types:
                if popos_type in this_type:
                    popos_dict[popos_type].append(popo)
        else:
            this_type = "other"
            popos_dict[popos_type].append(popo)

    return (total_popos, popos_dict)



def display_art():
    public_art = get_art_data_cached()
    total_art = len(public_art)
    art_dict = {}

    for letter in "abcdefghijklmnopqrstuvwxyz":
        art_dict[letter] = []

    for art in public_art:
        if "title" in art:
            alpha = art["title"].lstrip("\"'1234567890")[0].lower()
        else:
            alpha = "u"
        art_dict[alpha].append(art)

    return (total_art, art_dict)



@cache.cached(timeout=3600, key_prefix="display_by_hood_cached")
def display_by_hood():
    hoods = get_hood_data_cached()
    total_hoods = len(hoods)
    hood_dict = {}
    hood_links = {}

    for hood in hoods:
        hood_name = str(hood["name"].lower()).replace(" ", "").replace(".", "").replace("/", "")
        hood_dict[hood_name] = []
        if "link" in hood:
            hood_links[hood_name] = hood["link"]
        else:
            hood_links[hood_name] = []

    trucks = get_truck_data_cached()
    popos = get_popos_data_cached()
    public_art = get_art_data_cached()

    for hood in hoods:
        polygon = shape(hood["the_geom"])
        hood_name = str(hood["name"].lower()).replace(" ", "").replace(".", "").replace("/", "")

        for truck in trucks:
            truck_point = Point(truck["location"]["coordinates"])
            if polygon.contains(truck_point):
                truck["kind"] = "truck"
                truck["main_name"] = truck["applicant"]
                hood_dict[hood_name].append(truck)

        for popo in popos:
            popo_point = Point(popo["the_geom"]["coordinates"])
            if polygon.contains(popo_point):
                popo["kind"] = "popos"
                popo["main_name"] = popo["name"]
                hood_dict[hood_name].append(popo)

        for art in public_art:
            art_point = Point(art["the_geom"]["coordinates"])
            if polygon.contains(art_point):
                art["kind"] = "art"
                if "title" in art:
                    art["main_name"] = art["title"]
                else:
                    art["main_name"] = "Untitled"
                hood_dict[hood_name].append(art)

    # sort lists so each letter is alphabetized
    for hood, locations in hood_dict.items():
        locations.sort(key=lambda location: location["main_name"]) 

    temp_dict = {}

    for hood in hood_dict:
        temp_dict[hood] = [hood_dict[hood], hood_links[hood]]

    hood_dict = temp_dict

    return (total_hoods, hood_dict)