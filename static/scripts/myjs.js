"use strict"

$(document).ready(function() {

  /////////////////////////////////////
  // Toggle log in and sign up forms //
  /////////////////////////////////////

  $("#signUpBtn").click(function(){
      $("#logInForm").hide();
      $("#fNameSignUp, #lNameSignUp, #emailSignUp, #pwSignUp").attr("type", "text");
      $("#submitSignUp").attr("type", "submit");
      $("#signUpBtn").prop("disabled");
      $("#logInBtn").prop("disabled", false);
  });


  $("#logInBtn").click(function(){
      $("#fNameSignUp, #lNameSignUp, #emailSignUp, #pwSignUp, #submitSignUp").attr("type", "hidden");
      $("#logInForm").show();
      $("#logInBtn").prop("disabled");
      $("#signUpBtn").prop("disabled", false);
  });



  //////////////////
  // Toggle Alpha //
  //////////////////

  $(".alpha").click(function(){
    var alpha = $(this).html().replace(/\s+/g, '');
    $(".hideAlpha").hide();
    $("#" + alpha).show();
  });


}); // end of $(document).ready