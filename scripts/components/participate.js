lib.doWhenExists("#participate_form", function() {
  document
    .getElementById("participate_form")
    .addEventListener("submit", function(evt) {
      evt.preventDefault(); // prevent the form from submitting (until we want it to)

      var email_address = "bankonatlanta@gmail.com";

      var form_value_name = $('input[name="name"]').val(),
        form_value_phone = $('input[name="phone"]').val(),
        form_value_interests = $('select[name="interests"]').val(),
        form_value_comments = $('textarea[name="comments"]').val();

      var email_body =
        "User {name} requests more information about Bank On Atlanta.\n\n" +
        "Phone: {phone}\n" +
        "Interests: {interests}\n" +
        "Comments: {comments}";

      var email_subject = "User request for more info about Bank On Atlanta";
      var email_content = "";
      var email_url = "";

      if (
        form_value_name &&
        form_value_phone &&
        form_value_interests &&
        form_value_comments
      ) {
        // form is totally filled-out, carry on

        email_content = email_body
          .replace("{name}", form_value_name)
          .replace("{phone}", form_value_phone)
          .replace("{interests}", form_value_interests)
          .replace("{comments}", form_value_comments);

        email_url = encodeURI(
          "mailto:" +
            email_address +
            "?Subject=" +
            email_subject +
            "&Body=" +
            email_content
        );

        window.open(email_url, "_blank");
      } else {
        // form isn't fully filled-out yet
        alert("Please fill out the form completely before submitting.");
      }
    });
});
