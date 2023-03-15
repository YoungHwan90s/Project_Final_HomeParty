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
            callback()
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
/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close')

if(navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu')
    })
}

if(navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu')
    })
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction() {
    const navMenu = document.getElementById('nav-menu')
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*=============== CHANGE BACKGROUND HEADER ===============*/
function scrollHeader() {
    const header = document.getElementById('main-header')

    if(this.scrollY >= 50) header.classList.add('scroll-header'); else header.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)