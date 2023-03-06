import { Controller, Get, Render, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}
    
    @Get('/')
    @Render('index')
    index(@Req() req): { components: string } {
        return { components: 'main' };
    }

    @Get('/sign-up')
    @Render('index')
    signup(@Req() req): { components: string } {
        return { components: 'sign-up' };
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

    @Get('/wish-list')
    @Render('index')
    wishlist(@Req() req): { components: string } {
        return { components: 'wish-list' };
    }

    @Get('/manage')
    @Render('index')
    manage(@Req() req): { components: string } {
        return { components: 'manage' };
    }

    @Get('/manage-host')
    @Render('index')
    managehost(@Req() req): { components: string } {
        return { components: 'manage-host' };
    }

    @Get('/manage-guest')
    @Render('index')
    manageguest(@Req() req): { components: string } {
        return { components: 'manage-guest' };
    }

    @Get('/manage-history')
    @Render('index')
    managehistory(@Req() req): { components: string } {
        return { components: 'manage-history' };
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

    @Get('/party')
    @Render('index')
    party(@Req() req): { components: string } {
        return { components: 'party' };
    }

    @Get('/party-make')
    @Render('index')
    partymake(@Req() req): { components: string } {
        return { components: 'party-make' };
    }

    @Get('/party-host')
    @Render('index')
    partyhost(@Req() req): { components: string } {
        return { components: 'party-host' };
    }

    @Get('/party-host-detail')
    @Render('index')
    partyhostdetail(@Req() req): { components: string } {
        return { components: 'party-host-detail' };
    }

    @Get('/party-host-massage')
    @Render('index')
    partyhostmassage(@Req() req): { components: string } {
        return { components: 'party-host-massage' };
    }
}
