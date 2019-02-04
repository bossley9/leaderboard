


'use strict';



// separate unit tests into multiple various files
// https://medium.com/spatialdev/mocha-unit-testing-pattern-test-suite-setup-code-for-file-separated-test-e339a550dbf6
require("./testVariousRoute")(7);

describe("route tests p1", function() {

  require("./testLeaderboardEntries")

})
