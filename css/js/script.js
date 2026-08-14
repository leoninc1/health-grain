const enquiryForm = document.getElementById("enquiryForm");

if (enquiryForm) {

    enquiryForm.addEventListener("submit", function(event) {

        event.preventDefault();

        alert("Thank you! Your enquiry has been received.");

        enquiryForm.reset();

    });

}