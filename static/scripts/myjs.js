"use strict"

$(document).ready(function() {

  /////////////////////////////////////
  // Toggle log in and sign up forms //
  /////////////////////////////////////

  $("#signUpBtn").on("click", function(){
      $("#logInForm").hide();
      $("#fNameSignUp, #lNameSignUp").attr("type", "text");
      $("#emailSignUp").attr("type", "email");
      $("#pwSignUp").attr("type", "password");
      $("#submitSignUp").attr("type", "submit");
      $("#signUpBtn").prop("disabled");
      $("#logInBtn").prop("disabled", false);
  });


  $("#logInBtn").on("click", function(){
      $("#fNameSignUp, #lNameSignUp, #emailSignUp, #pwSignUp, #submitSignUp").attr("type", "hidden");
      $("#logInForm").show();
      $("#logInBtn").prop("disabled");
      $("#signUpBtn").prop("disabled", false);
  });


  //////////////////
  // Toggle Alpha //
  //////////////////

  $(".alpha").on("click", function(){
    // removes all whitespaces and lowercases
    var alpha = $(this).html().replace(/[\s\/\.]+/g, "").toLowerCase();
    $(".hideAlpha").hide();
    $("#" + alpha).show();
    var name = $(this).html();
    $("#pageName").html(name);
  });


  ////////////////////
  // Delete account //
  ////////////////////

  $("#deleteBtnModal").on("click", function() {
    $("#deleteBtnHidden").submit();
  });

  $("#deleteAcct").on("click", function() {
    $("#deleteModal").modal();
  });


}); // end of $(document).ready