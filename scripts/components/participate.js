lib.doWhenExists("#participate_form", function() {
  document
    .getElementById("participate_form")
    .addEventListener("submit", function(evt) {
      evt.preventDefault(); // prevent the form from submitting (until we want it to)

      // **********
      // Stuff to configure:
      var email_address = "bankonatlanta@gmail.com";

      var email_body =
        "User {name} requests more information about Bank On Atlanta.\n\n" +
        "Phone: {phone}\n" +
        "Interests: {interests}\n" +
        "Comments: {comments}";

      var email_subject = "User request for more info about Bank On Atlanta";
      // End of stuff to configure
      // **********

      var form_value_name = $('input[name="name"]').val(),
        form_value_phone = $('input[name="phone"]').val(),
        form_value_interests = $('select[name="interests"]').val(),
        form_value_comments = $('textarea[name="comments"]').val();

      var email_content, email_url;

      // Required fields: name & interests only
      if (form_value_name && form_value_interests) {
        email_content = email_body
          .replace("{name}", form_value_name)
          .replace("{phone}", form_value_phone)
          .replace("{interests}", form_value_interests)
          .replace("{comments}", form_value_comments);

        email_url = encodeURI(
          "mailto:" +
            email_address +
            "?subject=" +
            email_subject +
            "&body=" +
            email_content
        );

        window.open(email_url, "_blank");
      } else {
        // Required fields not filled out.
        alert("Please fill out the form completely before submitting.");
      }
    });
});
