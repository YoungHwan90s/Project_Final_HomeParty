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

/* -------------------------------- getMyInfo ------------------------------- */
function getMyInfo(callback) {
    $.ajax({
        type: 'GET',
        url: '/auth/my-info',
        headers: {
            authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
            refreshtoken: `${sessionStorage.getItem('refreshToken')}`,
        },
        success: function (response) {
            callback(response.user);
        },
        error: function (error) {
            callback();
        },
    });
}

/* -------------------------------- modal alert ------------------------------- */
function customAlert(text, confirmCallback) {
    $('#alertText').text(text);
    $('#alertModal').modal('show');
    if (confirmCallback) {
        $('#alertModal .btn-confirm').click(confirmCallback);
    }
}

/*=============== log out ===============*/
function logout() {
    sessionStorage.clear();
    customAlert('정상적으로 로그아웃 되었습니다.', function () {
        window.location.replace('/')
    });
}
