import { Controller, Get, Render, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('/')
    @Render('index')
    main(@Req() req): { components: string } {
        return { components: 'main' };
    }

    @Get('/party')
    @Render('index')
    party(@Req() req): { components: string } {
        return { components: 'party' };
    }

    @Get('/sign-up')
    @Render('index')
    signup(@Req() req): { components: string } {
        return { components: 'sign-up' };
    }

    @Get('/profile-upload')
    @Render('index')
    profileImage(@Req() req): { components: string } {
        return { components: 'profile-upload' };
    }

    @Get('/login')
    @Render('index')
    login(@Req() req): { components: string } {
        return { components: 'login' };
    }

    @Get('/find-email')
    @Render('index')
    findemail(@Req() req): { components: string } {
        return { components: 'find-email' };
    }

    @Get('/find-password')
    @Render('index')
    findpassword(@Req() req): { components: string } {
        return { components: 'find-password' };
    }

    @Get('/authentication')
    @Render('index')
    authentication(@Req() req): { components: string } {
        return { components: 'authentication' };
    }

    @Get('/reset-password')
    @Render('index')
    resetpassword(@Req() req): { components: string } {
        return { components: 'reset-password' };
    }

    @Get('/user-menu')
    @Render('index')
    usermenu(@Req() req): { components: string } {
        return { components: 'user-menu' };
    }

    @Get('/user-edit')
    @Render('index')
    useredit(@Req() req): { components: string } {
        return { components: 'user-edit' };
    }
    
    @Get('/user-check')
    @Render('index')
    usercheck(@Req() req): { components: string } {
        return { components: 'user-check' };
    }

    @Get('/user-mypage')
    @Render('index')
    usermypage(@Req() req): { components: string } {
        return { components: 'user-mypage' };
    }

    @Get('/user-wish-list')
    @Render('index')
    wishlist(@Req() req): { components: string } {
        return { components: 'wish-list' };
    }

    @Get('/user-host')
    @Render('index')
    managehost(@Req() req): { components: string } {
        return { components: 'user-host' };
    }

    @Get('/user-party')
    @Render('index')
    manageguest(@Req() req): { components: string } {
        return { components: 'user-party' };
    }

    @Get('/user-history')
    @Render('index')
    managehistory(@Req() req): { components: string } {
        return { components: 'user-history' };
    }

    @Get('/admin-user')
    @Render('index')
    adminuser(@Req() req): { components: string } {
        return { components: 'admin-user' };
    }

    @Get('/admin-party')
    @Render('index')
    adminparty(@Req() req): { components: string } {
        return { components: 'admin-party' };
    }

    @Get('/admin-review')
    @Render('index')
    adminreview(@Req() req): { components: string } {
        return { components: 'admin-review' };
    }

    @Get('/admin-tag')
    @Render('index')
    admintag(@Req() req): { components: string } {
        return { components: 'admin-tag' };
    }

    @Get('/party/:partyId')
    @Render('index')
    partyById(@Req() req): { components: string } {
        return { components: 'party-id' };
    }

    @Get('/party-edit/:partyId')
    @Render('index')
    partyEdit(@Req() req): { components: string } {
        return { components: 'party-edit' };
    }

    @Get('/party-new')
    @Render('index')
    partymake(@Req() req): { components: string } {
        return { components: 'party-new' };
    }

    @Get('/user-detail/:hostId')
    @Render('index')
    partyhostdetail(@Req() req): { components: string } {
        return { components: 'user-detail' };
    }

    @Get('/party-host-message')
    @Render('index')
    partyhostmassage(@Req() req): { components: string } {
        return { components: 'party-host-message' };
    }

    @Get('/party-review/:partyId')
    @Render('index')
    partyreview(@Req() req): { components: string } {
        return { components: 'party-review' };
    }

    @Get('/no-page')
    @Render('index')
    servicePending(@Req() req): { components: string } {
        return { components: 'no-page' };
    }


}