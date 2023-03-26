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
        url: `/user`,
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

/* ----------------------------- Daum Address Search --------------------------- */
function findAddr() {
    new daum.Postcode({
        oncomplete: function (data) {
            // 사용자 주소를 받아올 변수를 정의한다.
            var addr = '';

            //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === 'R') {
                // 사용자가 도로명 주소를 선택했을 경우(R)
                addr = data.roadAddress;
            } else {
                // 사용자가 지번 주소를 선택했을 경우(J)
                addr = data.jibunAddress;
            }

            // 부모창의 주소칸에 받아온 주소를 넣는다.
            $('#input-address-1').val(addr);
        },
    }).open();
}

/*----------------------------------- log out -----------------------------------*/
function logout() {
    $.ajax({
        type: 'GET',
        url: '/auth/logout',
        headers: {
            authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
            refreshtoken: `${sessionStorage.getItem('refreshToken')}`,
        },
        success: function (response) {
            customAlert('정상적으로 로그아웃 되었습니다.', function () {
                window.location.replace('/');
                sessionStorage.clear();
            });
        },
        error: function (response) {
            customAlert(response.responseJSON.message, function () {
                sessionStorage.clear();
                window.location.replace('/');
            });
        },
    });
}
/*--------------------------- Prevent Enter Key Action ---------------------------*/
function preventSubmit(event) {
    event.preventDefault();
}
