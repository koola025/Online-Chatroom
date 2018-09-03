# Software Studio 2018 Spring Midterm Project
## Notice
* Replace all [xxxx] to your answer

## Topic
* Chat room
* Key functions 
    1. chat 
    2. load message history
    3. chat with new user(add friend)
* Other functions 
    1. change personal photo
    2. send picture in chat room
    3. create group chat

## Basic Components
|Component|Score|Y/N|
|:-:|:-:|:-:|
|Membership Mechanism|20%|Y|
|GitLab Page|5%|Y|
|Database|15%|Y|
|RWD|15%|Y|
|Topic Key Function|15%|Y|

## Advanced Components
|Component|Score|Y/N|
|:-:|:-:|:-:|
|Third-Party Sign In|2.5%|Y|
|Chrome Notification|5%|N|
|Use CSS Animation|2.5%|Y|
|Security Report|5%|Y|
|Other functions|1~10%|Y|

## Website Detail Description
- Login Page

    <img src="/public/reportimg/1.png" width = 400px>

- SignUp Page

    <img src="/public/reportimg/2.png" width = 400px>

- Friend Page

    Once logined, the website will display the friend page, and will show all of your friends. The button on the left will open the toggle menu, and the button on the right is the logout button.

    <img src="/public/reportimg/3.png" width = 400px>

- Change personal photo

    You can change your photo by clicking on your own photo and upload from computer. If a user hasn't changed photo yet, it will display the default picture. If a user has logged in from Google, it will display the user's picture from Google, but the user can still change it afterwards.

    <img src="/public/reportimg/4.png" width = 400px>

- Add friend

    Click on users from the menu, and you can see all users. You can click on any user to send friend request.  

    <img src="/public/reportimg/5.png" width = 400px>

    After clicking on "Add friend", it will show the alert message and dismiss the modal.

    <img src="/public/reportimg/6.png" width = 400px>

    If you are already friends or friend request has already been sent (or you click on yourself), the "Add friend" button won't show.

    <img src="/public/reportimg/7.png" width = 400px>

- Friend Requests

    The person who received friend requests can see it in the "Requests" page, and can choose to accept.

    <img src="/public/reportimg/8.png" width = 400px>

    After accepting the friend request, both of them will see each other in their "Friend" page and the request will be deleted and displays "no requests".

    <img src="/public/reportimg/9.png" width = 400px>

    <img src="/public/reportimg/10.png" width = 400px>

    <img src="/public/reportimg/11.png" width = 400px>

- Group Page

    When you don't have any groups, it will display "no groups". You can create a new group with the button "Add".

    <img src="/public/reportimg/12.png" width = 400px>

    You can enter a name for the group, and choose a group photo. Click on the friends you want to add from the friend list, and it will disappear from the friend list and appear on the selected list.

    <img src="/public/reportimg/13.png" height = 400px>
    <img src="/public/reportimg/14.png" height = 400px>

    A new group is then created !

    <img src="/public/reportimg/15.png" width = 400px>

    Click on the group and you will go to the chat page. The title above is the group name.

    <img src="/public/reportimg/16.png" width = 400px>

    Type in any thing and you can also send pictures.

    <img src="/public/reportimg/17.png" width = 400px>

    Friends that are added into the group will also see the group on their page.

    <img src="/public/reportimg/18.png" height = 300px>
    <img src="/public/reportimg/19.png" height = 300px>

    And everyone can chat now!

    <img src="/public/reportimg/20.png" width = 400px>

- Chat with single friend

    Click on a friend from friend page and you can chat and send pictures with that friend. The title above shows the friend's name.

    <img src="/public/reportimg/21.png" width = 400px>




- CSS animation

    1. Jumpy Camera Button

        When the mouse hovers on the camera button, it bounces.
    
        <img src="/public/reportimg/22.png" width = 400px>

    2. Shiny Top Bar

        The top bar shines.

        <img src="/public/reportimg/23.png" width = 600px>
    
    3. Scroll message

        The message automatically scrolls to the bottom (the newest message).

- RWD
    
    It still fits well in different sizes of screens.   

    <img src="/public/reportimg/24.png" height = 300px>
    
    <img src="/public/reportimg/25.png" height = 300px>
    
    <img src="/public/reportimg/26.png" height = 300px>


## Security Report (Optional)

With rules written, only the user that is logged in can change his own datas.
