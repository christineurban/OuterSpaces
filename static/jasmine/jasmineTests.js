describe("Hides Food Trucks", function () {
  it("hides food trucks", function() {
    $("#truckMap").click();
    expect(truckMarkers[0].visible).toBe(false);
  });
});

describe("Hides POPOS", function () {
  it("hides POPOS", function() {
    $("#poposMap").click();
    expect(poposMarkers[0].visible).toBe(false);
  });
});

describe("Hides Art", function () {
  it("hides art", function() {
    $("#artMap").click();
    expect(artMarkers[0].visible).toBe(false);
  });
});

describe("Hide neighborhoods", function () {
  it("hides neighborhoods", function() {
    $("#hoodMap").click();
    expect(map.data.style.visible).toBe(false);
  });
});




  // it("Searches for OuterSpaces", function () {
  //   var evt = {
  //     type: "click",
  //     preventDefault: function () {}
  //   };

  //   $("#search").val("tacos");
  //   var preventDefaultSpy = spyOn(evt, "preventDefault");
  //   submitSearch(evt);
  //   expect(preventDefaultSpy).toHaveBeenCalledWith();
  //   expect(artMarkers[0].visible).toBe(false);
  // });

  // it("Searches by address", function () {
  //   $("#searchByAddress").val("450 sutter");
  //   $("#addressForm").submit();

  //   // for (marker of artMarkers) {
  //   //   if (marker.title.includes("Mark Lere")) {
  //   //     var test = marker;
  //   //   }
  //   // }
  //   expect(artMarkers[0].visible).toBe(false);
  // });