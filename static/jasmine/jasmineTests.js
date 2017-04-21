describe("My Test Suite", function () {

  it("Searches for OuterSpaces", function () {
    $("#search").val("tacos");
    $("#searchForm").submit();
    expect(artMarkers[0].visible).toBe(false);
  });

  it("Searches by address", function () {
    $("#searchByAddress").val("450 sutter");
    $("#addressForm").submit();

    for (marker of artMarkers) {
      if (marker.title.includes("Mark Lere")) {
        var test = marker;
      }
    }
    expect(test.visible).toBe(false);
  });



});
