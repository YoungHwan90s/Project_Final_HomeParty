# MOAVA-HOMEPARTY (모아바)

## 📝 목차
> Ⅰ. 프로젝트 소개</br>
> Ⅱ. 개발팀 소개</br>
> Ⅲ. 개발 환경</br>
> Ⅳ. 아키텍처</br>
> Ⅴ. 기술적 의사결정</br>
> Ⅵ. 주요 기술 및 기능</br>
> Ⅶ. ERD</br>
> Ⅷ. 디렉토리 구조</br>
> Ⅸ. 화면 구성</br>
> Ⅹ. 트러블 슈팅</br>

</br>

## 📢 **프로젝트 소개**
> 💡 모아바(MOAVA)- 홈파티 주최 및 참가
>
>증가하는 1인 세대!  파티를 열어 새로운 친구를 사귀세요!     
>모아바는 파티를 즐기고 싶지만 1인 가구이거나 동네 친구가 없어 즐길 수 없을 때,     
>내가 호스트 또는 게스트가 되어 취향에 맞게 참여할 수 있는 소셜 네트워크 서비스입니다!

</br>

<p align="center">
  <a href="http://moava-homeparty.site/" target="blank">
    <img src="https://user-images.githubusercontent.com/118159813/227510559-96bfc959-2f5f-4710-80a5-a39cf1792bcd.png" alt="Moava Logo" width="800"/>   </a>
</p>
<p align="center">
  <a href="https://hits.seeyoufarm.com">
    <img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2FYoungHwan90s%2FProject_Final_HomeParty%2Fhit-counter&count_bg=%2379C83D&title_bg=%23555555&icon=myspace.svg&icon_color=%23E7E7E7&title=hits&edge_flat=false"/>
  </a>
</p>

</br>

### 🏛️ Moava Wev Page v1.0
> 스파르타코딩클럽 백엔드 개발자 부트캠프 node.js 4기</br>
> 개발기간: 2023.02.27 ~ 2023.04.02

</br>

### 🏡 배포 주소
> http://moava-homeparty.site

</br>

### 🧩 디렉토리 구조
> 

<details>
  <summary>구조 보기</summary>

  ```
  Project_Final_HomeParty
  ├─ package-lock.json
  ├─ package.json
  ├─ src
  │  ├─ app.controller.ts
  │  ├─ app.module.ts
  │  ├─ app.service.ts
  │  ├─ chat.gateway.ts
  │  ├─ config
  │  │  ├─ config.jwt.ts
  │  │  ├─ config.nodemailer.ts
  │  │  ├─ config.redis.ts
  │  │  ├─ config.s3.ts
  │  │  └─ config.typeorm.ts
  │  ├─ main.ts
  │  ├─ modules
  │  │  ├─ admin
  │  │  │  ├─ admin.controller.ts
  │  │  │  ├─ admin.module.ts
  │  │  │  └─ admin.service.ts
  │  │  ├─ auth
  │  │  │  ├─ auth.controller.ts
  │  │  │  ├─ auth.module.ts
  │  │  │  ├─ auth.service.ts
  │  │  │  ├─ dto
  │  │  │  │  ├─ authenticate-code.dto.ts
  │  │  │  │  ├─ authenticate-email.dto.ts
  │  │  │  │  ├─ find-email.dto.ts
  │  │  │  │  ├─ kakao-login.dto.ts
  │  │  │  │  ├─ login.dto.ts
  │  │  │  │  └─ reset-password.dto.ts
  │  │  │  ├─ guards
  │  │  │  │  ├─ auth.guard.ts
  │  │  │  │  ├─ jwt-auth.guard.ts
  │  │  │  │  └─ kakao-auth.guard.ts
  │  │  │  └─ strategies
  │  │  │     ├─ jwt.strategy.ts
  │  │  │     ├─ kakao.strategy.ts
  │  │  │     └─ local.strategy.ts
  │  │  ├─ party
  │  │  │  ├─ dto
  │  │  │  │  ├─ create-party.dto.ts
  │  │  │  │  ├─ create-thumbnail.dto.ts
  │  │  │  │  └─ update-party.dto.ts
  │  │  │  ├─ entity
  │  │  │  │  ├─ party-member.entity.ts
  │  │  │  │  ├─ party.entity.ts
  │  │  │  │  ├─ tag.entity.ts
  │  │  │  │  └─ thumbnail.entity.ts
  │  │  │  ├─ party.controller.ts
  │  │  │  ├─ party.module.ts
  │  │  │  └─ party.service.ts
  │  │  ├─ review
  │  │  │  ├─ dto
  │  │  │  │  ├─ create-review.dto.ts
  │  │  │  │  └─ update-review.dto.ts
  │  │  │  ├─ entity
  │  │  │  │  └─ review.entity.ts
  │  │  │  ├─ review.controller.ts
  │  │  │  ├─ review.module.ts
  │  │  │  └─ review.service.ts
  │  │  └─ user
  │  │     ├─ dto
  │  │     │  ├─ create-user-profile.dto.ts
  │  │     │  ├─ create-user.dto.ts
  │  │     │  └─ update-user.dto.ts
  │  │     ├─ entity
  │  │     │  ├─ kakao.entitiy.ts
  │  │     │  ├─ user.entity.ts
  │  │     │  └─ wish-list.entity.ts
  │  │     ├─ user.controller.ts
  │  │     ├─ user.module.ts
  │  │     └─ user.service.ts
  │  ├─ util
  │  │  ├─ cache
  │  │  │  ├─ cache.module.ts
  │  │  │  └─ cache.service.ts
  │  │  ├─ joi
  │  │  │  ├─ joi-validation.pipe.ts
  │  │  │  └─ joi-validation.ts
  │  │  ├─ node-mailer
  │  │  │  ├─ mail.service.ts
  │  │  │  └─ node-mailer.module.ts
  │  │  └─ s3
  │  │     ├─ image-upload.controller.ts
  │  │     ├─ image-upload.module.ts
  │  │     └─ image-upload.service.ts
  │  └─ views
  │     ├─ 404-page.ejs
  │     ├─ admin-page.ejs
  │     ├─ admin-party.ejs
  │     ├─ admin-review.ejs
  │     ├─ admin-tag.ejs
  │     ├─ admin-user.ejs
  │     ├─ alert-modal.ejs
  │     ├─ auth-authentication.ejs
  │     ├─ auth-find-email.ejs
  │     ├─ auth-find-password.ejs
  │     ├─ auth-login.ejs
  │     ├─ auth-profile-upload.ejs
  │     ├─ auth-reset-password.ejs
  │     ├─ auth-sign-up.ejs
  │     ├─ index.ejs
  │     ├─ main.ejs
  │     ├─ party-detail.ejs
  │     ├─ party-edit.ejs
  │     ├─ party-host-message.ejs
  │     ├─ party-new.ejs
  │     ├─ party-review.ejs
  │     ├─ party.ejs
  │     ├─ public
  │     │  ├─ css
  │     │  │  ├─ admin-page.css
  │     │  │  ├─ common.css
  │     │  │  ├─ login.css
  │     │  │  ├─ main.css
  │     │  │  ├─ modal.css
  │     │  │  ├─ party-host-detail.css
  │     │  │  ├─ party-new.css
  │     │  │  ├─ partyGrid.css
  │     │  │  ├─ partyPage.css
  │     │  │  ├─ profile-upload.css
  │     │  │  ├─ reset.css
  │     │  │  ├─ signup.css
  │     │  │  ├─ user-edit.css
  │     │  │  ├─ user-menu.css
  │     │  │  └─ user-mypage.css
  │     │  ├─ imgs
  │     │  │  ├─ calendar.jpg
  │     │  │  ├─ error-404.png
  │     │  │  ├─ house.jpg
  │     │  │  ├─ inbox.jpg
  │     │  │  ├─ jjim.png
  │     │  │  ├─ kakao.png
  │     │  │  ├─ kakaologo.png
  │     │  │  ├─ logo.png
  │     │  │  ├─ map.jpg
  │     │  │  ├─ party.ico
  │     │  │  ├─ party.jpg
  │     │  │  ├─ party.png
  │     │  │  ├─ partymain.jpg
  │     │  │  ├─ phone.jpg
  │     │  │  ├─ review.jpg
  │     │  │  ├─ select.jpg
  │     │  │  ├─ temporary.png
  │     │  │  └─ welcome.jpg
  │     │  ├─ js
  │     │  │  └─ common.js
  │     │  └─ library
  │     │     ├─ carousel
  │     │     │  └─ carousel.js
  │     │     └─ datePicker
  │     │        ├─ base.css
  │     │        ├─ calendar.css
  │     │        ├─ calendar.js
  │     │        ├─ datePicker.css
  │     │        └─ datePicker.js
  │     ├─ user-check.ejs
  │     ├─ user-detail.ejs
  │     ├─ user-edit.ejs
  │     ├─ user-history.ejs
  │     ├─ user-host.ejs
  │     ├─ user-menu.ejs
  │     ├─ user-mypage.ejs
  │     ├─ user-party.ejs
  │     └─ user-wish-list.ejs
  ├─ tsconfig.build.json
  └─ tsconfig.json

  ```
</details>
</br></br>
 
## 🧑‍🤝‍🧑 **웹 개발팀 소개**
<table border="3">
  <tr align="center">
    <td colspan="5">
      <a href="https://www.notion.so/Sparta_Final_Project-11d2d3562bbd48b9b8776495036ea533">
        팀 노션 view
      </a>
    </td>
  </tr>
  <tr align="center">
  <td  width="400">오영환(팀장)</td>
  <td width="400">이정기(부팀장)</td>
  <td width="400">이설인(팀원)</td>
  <td width="400">이지영(팀원)</td>
  <td width="400">육준호(팀원)</td>
  </tr>
  <tr>
    <td>
      <p align="center">
        <img src="https://user-images.githubusercontent.com/118159813/227430656-060607cb-86da-41e2-965f-244864e22568.png" width="150" />
      </p>
    </td>
    <td>
      <p align="center">
        <img src="https://user-images.githubusercontent.com/118159813/227430883-e5223d40-964e-478c-a235-42c07a306ad7.png" width="150" />
      </p>
    </td>
    <td>
      <p align="center">
        <img src="https://user-images.githubusercontent.com/118159813/227430901-784af9c1-4333-4085-a722-8903aaf98830.png" width="150" />
      </p>
    </td>
    <td>
      <p align="center">
        <img src="https://user-images.githubusercontent.com/118159813/227430935-3f1a35d9-c284-4eef-857d-69f90e1aea30.png" width="150" />
      </p>
    </td>
    <td>
      <p align="center">
        <img src="https://user-images.githubusercontent.com/118159813/227431014-d8d403ed-667b-4d0f-8989-ae2e41ec13c0.png" width="150" />
      </p>
    </td>
  </tr>
  <tr align="center">
    <td>
      <a href="https://github.com/YoungHwan90s">
        @Young-hwan
      </a>
    </td>
    <td>
      <a href="https://github.com/wjdrl3122">
        @Jeong-gi
      </a>
    </td>
    <td>
      <a href="https://github.com/iffy-yeti">
        @Seol-in
      </a>
    </td>
    <td>
      <a href="https://github.com/easy2jiyoung">
        @Ji-young
      </a>
    </td>
    <td>
      <a href="https://github.com/six-ju">
        @Jun-ho
      </a>
    </td>
  </tr>
  <tr align="center">
    <td>
      소셜로그인, 로그인 인증전략, 캐싱적용, S3 이미지 업로드, Nodemailer, </br>
      EC2배포 및 Github action 자동배포</br>
    </td>
    <td>
      파티 조회, 파티 상세 조회,</br>
      파티 생성, 파티 승인/거절
    </td>
    <td>
      전반적인 디자인, CSS, 반응형 적용
    </td>
    <td>
      회원정보 조회, 수정, 탈퇴</br>
      파티 목록 검색 바 활성화 (3가지로 구분)</br>
      (관리자) 회원정보 조회, 삭제 - API만 구현
    </td>
    <td>
      카카오 맵, 리뷰CRUD,</br>
      관리자 페이지 및 검색기능 구현
    </td>
  </tr>
</table></br>
</br></br>

## 📚 **개발환경**

### Envrionment
<img src="https://img.shields.io/badge/VISUAL STUDIO CODE-007ACC?style=for-the-badge&logo=VISUAL STUDIO CODE&logoColor=white"> <img src="https://img.shields.io/badge/GIT-F05032?style=for-the-badge&logo=GIT&logoColor=white"> <img src="https://img.shields.io/badge/GITHUB-181717?style=for-the-badge&logo=GITHUB&logoColor=white">

### Config
<img src="https://img.shields.io/badge/NPM-CB3837?style=for-the-badge&logo=NPM&logoColor=white">

</br>

### Development
#### Front-end
<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=HTML5&logoColor=white"> <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=CSS3&logoColor=white"> <img src="https://img.shields.io/badge/JAVASCRIPT-F7DF1E?style=for-the-badge&logo=JAVASCRIPT&logoColor=white"> <img src="https://img.shields.io/badge/AJAX-rgba(15, 124, 186)?style=for-the-badge&logo=AJAX&logoColor=white"> <img src="https://img.shields.io/badge/JQUERY-0769AD?style=for-the-badge&logo=JQUERY&logoColor=white"> <img src="https://img.shields.io/badge/BOOTSTRAP-7952B3?style=for-the-badge&logo=BOOTSTRAP&logoColor=white"> <img src="https://img.shields.io/badge/EJS-rgba(167, 29, 71)?style=for-the-badge&logo=EJS&logoColor=white">

#### Back-end
<img src="https://img.shields.io/badge/NODE.JS-rgba(140, 193, 76)?style=for-the-badge&logo=NODE.JS&logoColor=white"> <img src="https://img.shields.io/badge/NEST.JS-E0234E?style=for-the-badge&logo=NEST.JS&logoColor=white"> <img src="https://img.shields.io/badge/TYPESCRIPT-3178C6?style=for-the-badge&logo=TYPESCRIPT&logoColor=white"> <img src="https://img.shields.io/badge/TYPEORM-rgba(221, 50, 34)?style=for-the-badge&logo=TYPEORM&logoColor=white"> <img src="https://img.shields.io/badge/MYSQL-4479A1?style=for-the-badge&logo=MYSQL&logoColor=white">

#### DevOps
<img src="https://img.shields.io/badge/REDIS CLOUD-rgba(193, 66, 52)?style=for-the-badge&logo=REDIS CLOUD&logoColor=white"> <img src="https://img.shields.io/badge/AWS-rgba(224, 162, 59)?style=for-the-badge&logo=AWS&logoColor=white"> <img src="https://img.shields.io/badge/RDS-rgba(208, 53, 47)?style=for-the-badge&logo=RDS&logoColor=white"> <img src="https://img.shields.io/badge/GITHUB ACTION-2088FF?style=for-the-badge&logo=GITHUB ACTION&logoColor=white">

### Communication
<img src="https://img.shields.io/badge/SLACK-4A154B?style=for-the-badge&logo=SLACK&logoColor=white"> <img src="https://img.shields.io/badge/NOTION-000000?style=for-the-badge&logo=NOTION&logoColor=white">

</br></br>

## 🚀 **아키텍처**
<p>
  <img src="https://user-images.githubusercontent.com/118159813/227509158-bf6b0df6-a081-4165-8d0d-623be234da95.png" width="800"/>
</p>
</br></br>

## 🔧 **기술적 의사결정**
<table border="3">
  <th align="center">사용 기술</th>
  <th align="center">기술 설명</th>
    <tr>
      <td>Nest.js</td>
      <td>Javascript보다 엄격한 타입 체크를 하는 typescript 기반의 웹 프레임 워크로 여러 예외 상황(에러 등)을 사전에 방지하기 용이함</td>
    </tr>
    <tr>
      <td>jQuery</td>
      <td>HTML DOM을 선택자를 이용해 손쉽게 조작할 수 있고, Ajax를 이용하여 클라이언트와 서버 간 데이터 통신을 편리하게 하기 위함</td>
    </tr>
    <tr>
    <td>MySQL</td>
    <td>관계형 데이터베이스 관리 시스템으로, 본 프로젝트 서비스의 복잡한 관계 설정을 원할하게 처리하기 위해 TypeORM과 MySQL을 사용</td>
  </tr>
  <tr>
    <td>JWT</td>
    <td>사용자의 권한이 확인되었을 경우에 Access-token 과 Refresh-token을 발급하여 해당 사용자를 인증할 때 필요한 토큰을 만드는 도구로 사용</td>
  </tr>
  <tr>
    <td>Redis Cloud</td>
    <td>메모리 기반의 데이터 저장소. 데이터를 빠르게 읽고 쓸 수 있도록 최적화 되어있는 백엔드 저장소로 빈번히 요청되는 데이터를 캐싱 처리할 목적으로 사용</td>
  </tr>
  <tr>
    <td>Nodemailer</td>
    <td>비밀번호 찾기 기능 - 본인이 회원가입한 이메일로 인증번호를 전송하기 위해 사용</br>서버에서 보내준 임의의 숫자와 클라이언트(브라우저)가 입력한 숫자가 일치하면 비밀번호 재설정</td>
  </tr>
  <tr>
    <td>RDS</td>
    <td>클라우드에서 관계형 데이터베이스의 배포 및 유지 관리를 용이하게 함</td>
  </tr>
  <tr>
    <td>S3</td>
    <td>프로필 및 파티 이미지 업로드 기능을 구현하기 위해 Amazons의 S3 Object Storage를 이용</td>
  </tr>
  <tr>
    <td>Github actions</td>
    <td>효율적인 배포 - workflow script를 정의하고 main branch가 merged & closed되었을 때 ssh action이 실행되어 자동 배포 될 수 있게 설정 및 사용</td>
  </tr>
</table>

</br></br>

## 🍀 **주요 기술 및 기능**
#### 🍃 PassportStrategy
- 사용자 인증을 위한 Jwt tokend 인증 전략 구현
- 사용자가 header에 인증 정보(토큰)와 함께 요청하면, 토큰을 검증하고 payload를 반환
- 사전에 정의해놓은 payload의 값에 일치하는 유저가 있는지 확인 후 유저 정보 반환

#### 🍃 Nodemailer
- 비밀번호 찾기 API에 적용
- 본인이 회원가입한 이메일로 인증번호를 전송하여, 일치 시 비밀번호를 재설정하는 단계에 사용

#### 🍃 캐싱 처리
- 서버 부하 및 속도 저하를 방지하기 위해 사용
- Redis Cloud(30MB 무료)를 사용하여 빈번히 사용되는 데이터를 캐싱 처리
- 인증 전략에서 반환하는 유저 값, Refresh Token, 메인 화면에 접속했을 때 요청되는 데이터 캐싱 적용

#### 🍃 Task Scheduling
- Schedule Module을 import 및 @Cron 데코레이터를 주입
- Party.service에 메서드를 선언 및 해당 데코레이터를 넣어서, 시작 날짜가 지난 파티는 자정에 맞춰 ‘마감’ 처리

#### 🍃 소셜 로그인
- 카카오톡 계정으로 로그인 가능
- 카카오톡 정보들도 회원 정보에 표시
<p>
  <img src="https://user-images.githubusercontent.com/118159813/227559177-d48630ef-c5e6-43fa-bf7e-8f0316bed9f4.png" width="600">
</p>

#### 🍃 카카오 맵
- 카카오맵 API를 사용해 위치 표출
- 파티 상세보기 - 파티 주소 마커 표시
- 찜한 목록들의 파티 주소를 한 맵에 마커 표시

</br></br>

## **ERD**
<p>
  <img src="https://user-images.githubusercontent.com/118159813/227559354-03c81e1e-4184-42e3-9f87-569b0dc00a2e.png" width="600">
</p>
</br></br>

## 📺 **화면 구성**
<table border="3" width="">
  <tr align="center">
    <td>메인 페이지</td>
    <td>위시리스트</td>
  </tr>
  <tr>
    <td>
      <p align="center">
        <img src="https://user-images.githubusercontent.com/118159813/227561599-afadd03b-7192-4c24-8791-b718f82f8681.png" width="400" />
      </p>
    </td>
    <td>
      <p align="center">
        <img src="https://user-images.githubusercontent.com/118159813/227561696-81574a56-e421-4fcb-bb90-5b4f5c1d5a03.png" width="400" />
      </p>
    </td>
  </tr>
  <tr align="center">
    <td>파티 탐색 페이지</td>
    <td>파티 개최 페이지</td>
  </tr>
  <tr>
    <td>
      <p align="center">
        <img src="https://user-images.githubusercontent.com/118159813/227561803-58bfc4c6-f3c8-404c-8056-19a9f603e878.png" width="400" />
      </p>
    </td>
    <td>
      <p align="center">
        <img src="https://user-images.githubusercontent.com/118159813/227561893-1a40727c-56d7-4940-a811-3925c9a5a10e.png" width="400" />
      </p>
    </td>
  </tr>
</table>
<br><br>

## **트러블 슈팅**
  ### ❗️ <span style="color: #2D3748; background-color:#fff5b1">**관계 테이블 저장 / 업데이트 이슈**</span>
  #### 🖊️ 사실 수집
  - 데이터를 불러올 때 관계 테이블이 조회되지 않는 문제
  - 일부 새로운 데이터를 받아 생성되어 있는 객체에 update 메서드를 사용하였을 때 기존 데이터는 삭제되는 문제

  #### 🤔 원인 추론
  - 데이터를 저장할 때 해당 엔티티와 연결되어 있는 관계 테이블을 연결하지 않았을 가능성
  - 즉, 생성하는 객체에 관계테이블 정보를 맵핑해주지 않아 조회 시 문제 발생
  - 기존에 가지고 있던 객체의 인스턴스를 맵핑해주지 않아서 update 메서드를 사용했을 때 삭제되는 문제 발생

  #### 💬 조치 및 결과
  - 프로젝트의 서비스에서 파티를 생성할 때 새로 생성하는 객체에 관계되어 있는 썸네일, 파티 멤버, 태그, 유저 테이블의 정보 관계를 맵핑하고 데이터를 저장
  - 배열 안에(OneToMany) 기존 정보를 복사(…)하고, 새로운 정보와 함께 관계 테이블의 인스턴스를 새롭게 맵핑
  - TypeORM의 relations를 사용하여 데이터 조회 시 관계 테이블도 데이터가 같이 출력되어 해결

</br>

  ### ❗️ <span style="color: #2D3748; background-color:#fff5b1">**사용자 검증 로직의 DB 접근 횟수 이슈**</span>
  #### 🖊️ 사실 수집
  - @UseGuards(JWTAuthGuard)를 사용하여, 권한이 필요한 API에 해당 데코레이터를 사용
  - 발급한 토큰이 유효하다면 로그인 한 유저의 정보를 반환하기 위해 매번 DB에서 해당된 유저의 정보를 찾고 반환

  #### 🤔 문제 추론
  - 매번 DB에서 유저 정보를 찾아 반환하는 것은 서버에 부하를 줄 수 있으며 비효율적임

  #### 💬 조치 및 결과
  - @UseGuards(LocalAuthGuard)를 통해 반환되는 유저 정보의 id(PK)와 이메일을 키 값으로 사용하여 각각 RefreshToken과 유저 정보를 redis-cloud에 캐싱처리
  - Jwt 전략의 `fromAuthHeaderAsBearerToken` 에서 반환한 payload의 email에 해당하는 value가 있는지 redis에 먼저 확인하고 유저를 반환하도록 전환
  - 데이터베이스의 접근 횟수가 현저히 감소하게 되어 서버 부하 방지 및 속도 개선

</br>

  ### ❗️ <span style="color: #2D3748; background-color:#fff5b1">**Github actions 자동배포 Pull request permission denied 이슈** </span>
  #### 🖊️ 사실 수집
  - main branch에 PR merged & closed 되었을 때 workflow에 설정한 ssh action이 실행되도록 설정
  - 액션이 실행되고, 업데이트 된 main branch를 새로 pull 할때 발생하는 권한 문제(git pull origin main)

  #### 🤔 문제 추론
  - 기존에 sudo -s로 접속하여 권한이 필요한 명령어를 순서대로 실행
  - 터미널에서 ubuntu에 접속하여 테스트했을 당시에는 문제가 없었으나, workflow의 script에서 실행하는 sudo에서 발생하는 문제
  - 프로젝트 깃헙 설정에 외부 접근을 허용하지 않아서 발생하는 문제

  #### 💬 조치 및 결과
  - 원격에 있는 git pull 및 pm2를 kill 및 restart 하기 위해서는 root 권한이 필요
  - git pull을 위해 chmod 퍼미션을 644로 변경하고, 모두 sudo로 실행
