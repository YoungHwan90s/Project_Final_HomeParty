/* ------------------------------- DatePicker ------------------------------- */

[...document.querySelectorAll('.datePickerWrapper')].forEach(($datePickerWrapper) => {
    new DatePicker($datePickerWrapper);
});

/* -------------------------------- Carousel -------------------------------- */

[...document.querySelectorAll('.carousel')].forEach(($carousel) => {
    new Carousel($carousel);
});

/* ------------------------------- Image-upload ------------------------------- */
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
            $('#imagePreview').hide();
            $('#imagePreview').fadeIn(650);
        };
        reader.readAsDataURL(input.files[0]);
    }
}
