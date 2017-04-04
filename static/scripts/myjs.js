"use strict"

$(document).ready(function() {

  /////////////////////////////////////
  // Toggle log in and sign up forms //
  /////////////////////////////////////

  $("#signupBtn").click(function(){
      $("#loginForm").hide();
      $("#fNameSignup, #lNameSignup, #emailSignup, #pwSignup").attr("type", "text");
      $("#submitSignup").attr("type", "submit");
      $("#signupBtn").prop("disabled");
      $("#loginBtn").prop("disabled", false);
  });


  $("#loginBtn").click(function(){
      $("#fNameSignup, #lNameSignup, #emailSignup, #pwSignup, #submitSignup").attr("type", "hidden");
      $("#loginForm").show();
      $("#loginBtn").prop("disabled");
      $("#signupBtn").prop("disabled", false);
  });

}); // end of $(document).ready