var txtEmail = document.getElementById('txtEmail');
var txtPassword = document.getElementById('txtPassword');
var txtEmail2 = document.getElementById('txtEmail2');
var txtPassword2 = document.getElementById('txtPassword2');
var btnLogin = document.getElementById("btnLogin");
var btnSignUp = document.getElementById("btnSignUp");
var goToSignUp = document.getElementById('gosu');
var cancel = document.getElementById('cancelSignUp');
var userName = document.getElementById('userName');
var btnAddFriend = document.getElementById('btnAddFriend');
var btnFR = document.getElementById('btnFR');
var messageText = document.getElementById('messageText');
var btnSend = document.getElementById('btnSend');
var requestFriend, toBeFriend;
var crKey;
var friendBox = document.getElementById('friendBox');
var btnFriends = document.getElementById('btnFriends');
var filePicker = document.getElementById("filePicker");
var userPhoto = document.getElementById("userPhoto");
var btnGoogle = document.getElementById("googleOut");
var btnUsers = document.getElementById("btnUsers");
var topTitle = document.getElementById("topTitle");
var modalPic = document.getElementById("modalPic");
var sendPic = document.getElementById("sendPic");
var chooseGPic = document.getElementById("chooseGPic");
var btnAddGroup = document.getElementById("btnAddGroup");
var btnCreateGroup = document.getElementById("btnCreateGroup");
var groupNaming = document.getElementById("groupNaming");
var toAdd = [];
var gURL;

btnLogin.addEventListener('click', function(event){logIn(event);});
btnSignUp.addEventListener('click', function(event){signUp(event);});
goToSignUp.addEventListener('click', function(event){console.log("click");goSignUp(event);});
cancel.addEventListener('click', function(event){console.log("click");cancelSignUp(event);});
btnAddFriend.addEventListener('click', function(event){sendFriendRequest(event);});
btnAcceptFR.addEventListener('click', function(event){becomeFriend(event);});
//btnFR.addEventListener('click', function(event){refreshFR(event);});
btnSend.addEventListener('click', function(event){sendMessage(event);});
btnFriends.addEventListener('click', function(event){openFriend(event);});
btnUsers.addEventListener('click', function(event){openUser(event);});
btnG.addEventListener('click', function(event){openGroup(event);});
btnFR.addEventListener('click', function(event){openFR(event);});
filePicker.addEventListener("change",function(event){loadImage(event);});
sendPic.addEventListener("change",function(event){sendImage(event);});
chooseGPic.addEventListener("change",function(event){chooseGImage(event);});
btnAddGroup.addEventListener("click",function(event){addGroup(event);});
btnCreateGroup.addEventListener("click",function(event){createGroup(event);});
btnGoogle.addEventListener('click', function () {
    var provider = new firebase.auth.GoogleAuthProvider();
    var suc = true;
    firebase.auth().signInWithPopup(provider).then(function(result){
        var user = result.user;
        firebase.database().ref('users/' + user.uid).update({
            email: user.email,
            name: user.displayName,
            photoURL: user.photoURL,
        }).catch(function(error){
            console.error("寫入使用者資訊錯誤",error);
        });

        txtEmail.value = "";
        txtPassword.value = "";
        if (suc == true) location.href = 'index.html';
    }).catch(function(error) {
        
        console.log(error.message);
        txtEmail.value = "";
        txtPassword.value = "";
        alert(error.message);
        suc = false;
    });
});

function createGroup(event) {
    var gname = groupNaming.value;
    var chatRoomData = {
        name : gname,
        photoURL: gURL
    }
    var newCRKey = firebase.database().ref().child('chatRooms/').push().key;

    var updates = {};  
    updates['chatRooms/' + newCRKey] = chatRoomData;  
    firebase.database().ref().update(updates);
    
    var cuid = firebase.auth().currentUser.uid;
    var pack = {
        chatroom: newCRKey,
        name: gname,
        photoURL: gURL
    }

    updates = {};  
    updates['users/' + cuid + '/groups/'+ newCRKey] = pack;  
    firebase.database().ref().update(updates);

    console.log("ddd " +toAdd);

    for(var i = 0; i < toAdd.length; i++) {
        updates = {};  
        updates['users/' + toAdd[i].UI + '/groups/' + newCRKey] = pack;  
        firebase.database().ref().update(updates);
        console.log("new a " + toAdd[i].UI + "this is i " + i);
    }
    toAdd = [];
    groupNaming.value = "";
    refreshG();
    gURL = "";
}

function addGroup(event) {
    $("#groupFL").empty();
    $("#groupAdded").empty();
    
    var database = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/friends/');//前面介紹那些order、limit都可以用
    database.once('value', function(snapshot){
        var count = 0;
        snapshot.forEach(function(childSnapshot) {
            count++;
            var div = document.createElement("DIV");        
            var UI = childSnapshot.val().FRID;
            console.log(UI);
            var db = firebase.database().ref('users/' + UI); //前面介紹那些order、limit都可以用
            db.once('value', function(s){

                
                var name = s.val().name;
                var url;
                
                var imgDiv = document.createElement("DIV"); 
                var t = document.createElement("DIV");  
                t.innerHTML = name;
                if (s.val().photoURL) url = "url("+ s.val().photoURL +")";
                else url = "url(../img/userPhoto.jpg)";
                imgDiv.style.backgroundImage = url;
                div.appendChild(imgDiv);      
                div.appendChild(t);                                
                groupFL.appendChild(div);
                t.setAttribute("class","t");
                imgDiv.setAttribute("class","friendImg");
                div.setAttribute("data-toggle","modal");
                //div.setAttribute("data-target","#exampleModal")
                div.setAttribute("id","gFL" + UI);
                div.setAttribute("class","eachLine");
                console.log(div.id);
                div.addEventListener('click', function(event){addInGroup(event, div.id, name, url);});
            });           
        });
        if (count == 0) {
            var emptyDiv = document.createElement("DIV");
            emptyDiv.style.backgroundImage = "url(../img/noF.png)";
            emptyDiv.setAttribute("class","emptyDiv");
            groupFL.appendChild(emptyDiv);
        }
    });
    toAdd = [];
}

function addInGroup(event, gFL, name, url) {
    hide(gFL);
    
    var div = document.createElement("DIV");
    var imgDiv = document.createElement("DIV"); 
                var t = document.createElement("DIV");  
                t.innerHTML = name;
                imgDiv.style.backgroundImage = url;
                div.appendChild(imgDiv);      
                div.appendChild(t);                                
                groupAdded.appendChild(div);
                t.setAttribute("class","t");
                imgDiv.setAttribute("class","friendImg");
                div.setAttribute("data-toggle","modal");
                //div.setAttribute("data-target","#exampleModal")
                div.setAttribute("id","gA" + UI);
                div.setAttribute("class","eachLine");
    var UI = gFL.split("gFL")[1];
    var pushData = {
        UI: UI,
        name: name,
        photoURL: url
    };
    console.log(pushData);
    toAdd.push(pushData);
}
function chooseGImage(event) {
    var storageRef = firebase.storage().ref();
    var file = event.target.files[0];
    var user = firebase.auth().currentUser;
    var uploadTask = storageRef.child('groupPhotos/' + file.name).put(file);
    
    uploadTask.on('state_changed', function(snapshot){
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
                console.log('Upload is paused');
                break;
            case firebase.storage.TaskState.RUNNING:
                console.log('Upload is running');
                break;
        }
    }, function(error) {

    }, function() {
        gURL = uploadTask.snapshot.downloadURL;
        console.log("hey " + gURL);
        
    });
}
function sendImage(event) {
    var storageRef = firebase.storage().ref();
    var file = event.target.files[0];
    var user = firebase.auth().currentUser;
    var uploadTask = storageRef.child('chatPhotos/' + crKey + "/" + file.name).put(file);
    
    uploadTask.on('state_changed', function(snapshot){
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
                console.log('Upload is paused');
                break;
            case firebase.storage.TaskState.RUNNING:
                console.log('Upload is running');
                break;
        }
    }, function(error) {

    }, function() {
        var downloadURL = uploadTask.snapshot.downloadURL;
        console.log(downloadURL);

        var messageData = {  
            sender: firebase.auth().currentUser.displayName,
            senderPhoto: firebase.auth().currentUser.photoURL,
            data: "<div class='sendPicDiv' style='background-image: url("+downloadURL+");'></div></p></div>"
        }; 
        console.log("this is crkey" + crKey);
        var newMesKey = firebase.database().ref('chatRooms/' + crKey + '/messages/').push().key; 
        
        var updates = {};  
        updates['/chatRooms/' + crKey + '/messages/' + newMesKey] = messageData;  
        
        firebase.database().ref().update(updates);
    });
}

function loadImage(event) {
    var storageRef = firebase.storage().ref();
    var file = event.target.files[0];
    var user = firebase.auth().currentUser;
    var uploadTask = storageRef.child('userPhotos/' + user.uid + "/" + file.name).put(file);
    
    uploadTask.on('state_changed', function(snapshot){
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
                console.log('Upload is paused');
                break;
            case firebase.storage.TaskState.RUNNING:
                console.log('Upload is running');
                break;
        }
    }, function(error) {

    }, function() {
        var downloadURL = uploadTask.snapshot.downloadURL;
        console.log(downloadURL);
        user.updateProfile({
            photoURL: downloadURL
        }).then(function(){
            var updates = {};
            updates['users/' + user.uid + "/photoURL"] = user.photoURL;
            firebase.database().ref().update(updates).then(function() {
                userPhoto.style.backgroundImage = "url(" + user.photoURL + ")";
                location.reload();
            }).catch(function(error){
            console.log(error);
            });
        }, function(error) {
            console.log(error);
        });
    });
}

function openUser(event) {
    hide("requestsBox");
    hide("groupBox");
    show("userBox");
    hide("messageBox");
    hide("friendBox");
    topTitle.innerHTML = "Users";
}

function openFriend(event) {
    hide("requestsBox");
    hide("groupBox");
    show("friendBox");
    hide("messageBox");
    hide("userBox");
    topTitle.innerHTML = "Friends";
}
function openGroup(event) {
    refreshG();
    hide("requestsBox");
    hide("groupBox");
    show("groupBox");
    hide("userBox");
    hide("messageBox");
    hide("friendBox");
    topTitle.innerHTML = "Groups";
}
function openFR(event) {
    show("requestsBox");
    hide("groupBox");
    hide("userBox");
    hide("messageBox");
    hide("friendBox");
    topTitle.innerHTML = "Requests";
}

function sendMessage(event) {
    if (messageText.value != "") {
        var messageData = {  
            sender: firebase.auth().currentUser.displayName,
            senderPhoto: firebase.auth().currentUser.photoURL,
            data: messageText.value + "</p></div>"
        }; 
        console.log("this is crkey" + crKey);
        var newMesKey = firebase.database().ref('chatRooms/' + crKey + '/messages/').push().key; 
        
        var updates = {};  
        updates['/chatRooms/' + crKey + '/messages/' + newMesKey] = messageData;  
        
        firebase.database().ref().update(updates);  
        messageText.value = "";
        
    }

}
$('#sendForm').submit(function(){
    return false;
})


function refreshFL(event) {
    $("#bshow").empty();
    
    var database = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/friends/');//前面介紹那些order、limit都可以用
    database.once('value', function(snapshot){
        var count = 0;
        snapshot.forEach(function(childSnapshot) {
            count++;
            var div = document.createElement("DIV");        
            var UI = childSnapshot.val().FRID;
            console.log(UI);
            var db = firebase.database().ref('users/' + UI); //前面介紹那些order、limit都可以用
            db.once('value', function(s){

                
                var name = s.val().name;
                var url;
                
                var imgDiv = document.createElement("DIV"); 
                var t = document.createElement("DIV");  
                t.innerHTML = name;
                if (s.val().photoURL) imgDiv.style.backgroundImage = "url("+ s.val().photoURL +")";
                else imgDiv.style.backgroundImage = "url(../img/userPhoto.jpg)";
                div.appendChild(imgDiv);      
                div.appendChild(t);                                
                bshow.appendChild(div);
                t.setAttribute("class","t");
                imgDiv.setAttribute("class","friendImg");
                div.setAttribute("data-toggle","modal");
                //div.setAttribute("data-target","#exampleModal")
                div.setAttribute("id","FL" + UI);
                div.setAttribute("class","eachLine");
                console.log(div.id);
                div.addEventListener('click', function(event){goChat(event, div.id);});
            });           
        });
        if (count == 0) {
            var emptyDiv = document.createElement("DIV");
            emptyDiv.style.backgroundImage = "url(../img/noF.png)";
            emptyDiv.setAttribute("class","emptyDiv");
            bshow.appendChild(emptyDiv);
        }
    });
    
}

function refreshG(event) {
    $("#dshow").empty();
    
    var database = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/groups/');//前面介紹那些order、limit都可以用
    database.once('value', function(snapshot){
        var count = 0;
        snapshot.forEach(function(s) {
            count++;
            var div = document.createElement("DIV");        
            
                var name = s.val().name;
                var url;
                
                var imgDiv = document.createElement("DIV"); 
                var t = document.createElement("DIV");  
                t.innerHTML = name;
                if (s.val().photoURL) url = "url("+ s.val().photoURL +")";
                else url = "url(../img/userPhoto.jpg)";
                imgDiv.style.backgroundImage = url;
                div.appendChild(imgDiv);      
                div.appendChild(t);                                
                dshow.appendChild(div);
                t.setAttribute("class","t");
                imgDiv.setAttribute("class","friendImg");
                div.setAttribute("data-toggle","modal");
                div.setAttribute("id","G" + s.val().chatroom);
                div.setAttribute("class","eachLine");
                console.log(div.id);
                div.addEventListener('click', function(event){goGChat(event, div.id);});
                       
        });
        if (count == 0) {
            var emptyDiv = document.createElement("DIV");
            emptyDiv.style.backgroundImage = "url(../img/noG.png)";
            emptyDiv.setAttribute("class","emptyDiv");
            dshow.appendChild(emptyDiv);
        }
    });
    
}

function goGChat(event, a) {
    show("messageBox");
    hide("groupBox");

    $("#history").empty();

    var key = a.split("G")[1];

    var title = firebase.database().ref('chatRooms/' + key); 
        title.once('value',function(s){
            console.log(s.val().name);
            var name = s.val().name;
            
            topTitle.innerHTML = name;
                                   
        });

    
            crKey = key;
            console.log(crKey);
        
            var str_before_username = "<div class='aaa media'><div id = 'head' style='background-image: url(" 
            var middle = ");'></div><div class='messageP'><p class=' p-1 pb-1 mb-0 small text-white'><strong class='d-block'>";
            var str_after_content = "</div></div>\n";
            var mesRef = firebase.database().ref('chatRooms/' + crKey + '/messages/');
            // List for store posts html
            var total_mes = [];
            // Counter for checking history post update complete
            var first_count = 0;
            // Counter for checking when to update new post
            var second_count = 0;
            var history = document.getElementById('history');
            
            
            
            mesRef.once('value')
            .then(function (snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    

                    var name;
                    var url;
                    var childData = childSnapshot.val();
                    if (childData.senderPhoto) url = childData.senderPhoto;
                    else url = "../img/userPhoto.jpg";
                    total_mes[total_mes.length] = str_before_username + url + middle + childData.sender + "</strong>" + childData.data + str_after_content;
                    
                    first_count += 1;
                    console.log("ahh " + childData.data);
                    document.getElementById('history').innerHTML = total_mes.join('');
                    history.scrollTop = history.scrollHeight;
                    /*console.log("bh " + childData.data);
                    var db = firebase.database().ref('users/' + childData.sender); 
                    db.once('value',function(s){
                        name = s.val().name;
                        if (s.val().photoURL)
                        url = s.val().photoURL;
                        else url = "../img/userPhoto.jpg";
                        
                       
                    }); */
                });
                              
                
                mesRef.on('child_added', function(data) {
                    
                    second_count += 1;
                    if (second_count > first_count) {
                        var childData = data.val();
                        var url;
                    
                        if (childData.senderPhoto) url = childData.senderPhoto;
                        else url = "../img/userPhoto.jpg";
                        total_mes[total_mes.length] = str_before_username + url + middle + childData.sender + "</strong>" + childData.data + str_after_content;
                            document.getElementById('history').innerHTML = total_mes.join('');
                            history.scrollTop = history.scrollHeight;
                        var db = firebase.database().ref('users/' + childData.sender); 
                        /*db.once('value', function(s){
                            var name;   
                            name = s.val().name;
                            var url;
                            if (s.val().photoURL)
                            url = s.val().photoURL;
                            else url = "../img/userPhoto.jpg";
                            
                        }); */
                    }
                });
                
            })
            .catch(e => console.log(e.message));
    
}

function addChatRoom(FID) {
    console.log("add chat room");
    var chatRoomData = {
        member : {
            [firebase.auth().currentUser.uid] : firebase.auth().currentUser.uid,
            [FID] : FID
        }

    }
    var newCRKey = firebase.database().ref().child('chatRooms/').push().key;
    var updates = {};  
    updates['chatRooms/' + newCRKey] = chatRoomData;  
    firebase.database().ref().update(updates);
    
    var cuid = firebase.auth().currentUser.uid;

    updates = {};  
    updates['users/' + cuid + '/friends/' + FID + '/chatRoom/'] = newCRKey;  
    firebase.database().ref().update(updates);

    updates = {};  
    updates['users/' + FID + '/friends/' + cuid + '/chatRoom/'] = newCRKey;  
    firebase.database().ref().update(updates);

    /*var cuid = firebase.auth().currentUser.uid;
    var db = firebase.database().ref('users/' + cuid + '/friends')
    db.set({
        [FID]: {
            FRID: toBeFriend,
            chatRoom: ""
        }
    })
    var db2 = firebase.database().ref('users/' + toBeFriend + '/friends')
    db2.set({
        [cuid]: {
            FRID: cuid,
            chatRoom: ""
        }
    })*/

   
}


function goChat(event, FLID) {
    show("messageBox");
    hide("friendBox");

    $("#history").empty();

    var UI = FLID.split("FL")[1];

    var title = firebase.database().ref('users/' + UI); 
        title.once('value',function(s){
            var name = s.val().name;
            topTitle.innerHTML = name;
                        
                       
        });

    var database = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/friends/' + UI);
    database.once('value', function(snapshot){
        var room = snapshot.val().chatRoom;
            console.log(room);
            crKey = room;
            console.log(crKey);
        
            var str_before_username = "<div class='aaa media'><div id = 'head' style='background-image: url(" 
            var middle = ");'></div><div class='messageP'><p class=' p-1 pb-1 mb-0 small text-white'><strong class='d-block'>";
            var str_after_content = "</div></div>\n";
            var mesRef = firebase.database().ref('chatRooms/' + crKey + '/messages/');
            // List for store posts html
            var total_mes = [];
            // Counter for checking history post update complete
            var first_count = 0;
            // Counter for checking when to update new post
            var second_count = 0;
            var history = document.getElementById('history');
            
            
            
            mesRef.once('value')
            .then(function (snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    

                    var name;
                    var url;
                    var childData = childSnapshot.val();
                    if (childData.senderPhoto) url = childData.senderPhoto;
                    else url = "../img/userPhoto.jpg";
                    total_mes[total_mes.length] = str_before_username + url + middle + childData.sender + "</strong>" + childData.data + str_after_content;
                    
                    first_count += 1;
                    console.log("ahh " + childData.data);
                    document.getElementById('history').innerHTML = total_mes.join('');
                    history.scrollTop = history.scrollHeight;
                    /*console.log("bh " + childData.data);
                    var db = firebase.database().ref('users/' + childData.sender); 
                    db.once('value',function(s){
                        name = s.val().name;
                        if (s.val().photoURL)
                        url = s.val().photoURL;
                        else url = "../img/userPhoto.jpg";
                        
                       
                    }); */
                });
                              
                
                mesRef.on('child_added', function(data) {
                    
                    second_count += 1;
                    if (second_count > first_count) {
                        var childData = data.val();
                        var url;
                    
                        if (childData.senderPhoto) url = childData.senderPhoto;
                        else url = "../img/userPhoto.jpg";
                        total_mes[total_mes.length] = str_before_username + url + middle + childData.sender + "</strong>" + childData.data + str_after_content;
                            document.getElementById('history').innerHTML = total_mes.join('');
                            history.scrollTop = history.scrollHeight;
                        var db = firebase.database().ref('users/' + childData.sender); 
                        /*db.once('value', function(s){
                            var name;   
                            name = s.val().name;
                            var url;
                            if (s.val().photoURL)
                            url = s.val().photoURL;
                            else url = "../img/userPhoto.jpg";
                            
                        }); */
                    }
                });
                
            })
            .catch(e => console.log(e.message));
    });
            
}
        
function becomeFriend(event) {
    
    var cuid = firebase.auth().currentUser.uid;
    
    var NFdata = {
        FRID: toBeFriend
    }
    //var  = firebase.database().ref().child('friendRequests/'  + requestFriend).push().key;
    var updates = {};  
    updates['users/'  + cuid + "/friends/" + toBeFriend] = NFdata;  
    firebase.database().ref().update(updates);
    
    NFdata = {
        FRID: cuid
    }
    
    updates['users/'  + toBeFriend + "/friends/" + cuid] = NFdata;  
    firebase.database().ref().update(updates);
    
    addChatRoom(toBeFriend);
    /*var db = firebase.database().ref('users/' + cuid + '/friends')
    db.set({
        [toBeFriend]: {
            FRID: toBeFriend,
            chatRoom: ""
        }
    })
    var db2 = firebase.database().ref('users/' + toBeFriend + '/friends')
    db2.set({
        [cuid]: {
            FRID: cuid,
            chatRoom: ""
        }
    })*/
    var toDel = firebase.database().ref('friendRequests/' + cuid).orderByChild("sender").equalTo(toBeFriend);
    toDel.once('value', function(snapshot){
        snapshot.forEach(function(childSnapshot) {
            console.log(childSnapshot.key);
            firebase.database().ref('friendRequests/' + cuid).child(childSnapshot.key).remove();
        });
    }).then(function(){refreshFR();})
    alert("You are friends now <3");
    console.log(toDel);
    //toDel.getParent().remove();
    refreshFL(event);
}

function refreshFR(event) {
    $("#cshow").empty();
    var count = 0;
    var database = firebase.database().ref('friendRequests/' + firebase.auth().currentUser.uid);//前面介紹那些order、limit都可以用
    database.once('value', function(snapshot){
        snapshot.forEach(function(childSnapshot) {
            count++;
            var div = document.createElement("DIV");        
            var UI = childSnapshot.val().sender;
            console.log(UI);
            var db = firebase.database().ref('users/' + UI); //前面介紹那些order、limit都可以用
            db.once('value', function(s){
                
                console.log("empty r " + count);
                var name = s.val().name;
                var url;
                var imgDiv = document.createElement("DIV"); 
                var t = document.createElement("DIV");  
                t.innerHTML = name;
                if (s.val().photoURL) imgDiv.style.backgroundImage = "url("+ s.val().photoURL +")";
                else imgDiv.style.backgroundImage = "url(../img/userPhoto.jpg)";
                div.appendChild(imgDiv);
                div.appendChild(t);                                
                cshow.appendChild(div);
                t.setAttribute("class","t");
                imgDiv.setAttribute("class","friendImg");
                div.setAttribute("class","eachLine");
                div.setAttribute("data-toggle","modal");
                div.setAttribute("data-target","#exampleModal")
                div.setAttribute("id","FR" + UI);
                console.log(div.id);
                div.addEventListener('click', function(event){openModalrequest(event, div.id);});
            });           
        });
        if (count == 0) {
            console.log("empty r " + count);
            var emptyDiv = document.createElement("DIV");
            emptyDiv.style.backgroundImage = "url(img/noFR.png)";
            emptyDiv.setAttribute("class","emptyDiv");
            cshow.appendChild(emptyDiv);
        }
    });
}

function sendFriendRequest(event) {
    console.log("add friend");
    
    var FRdata = {
        sender: firebase.auth().currentUser.uid,
        time: firebase.database.ServerValue.TIMESTAMP
    }
    var newFRKey = firebase.database().ref().child('friendRequests/'  + requestFriend).push().key;
    var updates = {};  
    updates['friendRequests/'  + requestFriend + "/" + newFRKey] = FRdata;  
    firebase.database().ref().update(updates);
    alert("Friend request has been sent successfully!");
}

function goSignUp(event) {
    console.log("go sign up");
    hide("loginBox");
    show("signUpBox");
}

function cancelSignUp(event) {
    console.log("cancel sign up");
    hide("signUpBox");
    show("loginBox");
}

function logIn(event) {
    console.log("aaa");
    var email = txtEmail.value;
    var password = txtPassword.value;
    firebase.auth().signInWithEmailAndPassword(email, password).catch(e => console.log(e.message));
    
    txtEmail.value = "";
    txtPassword.value = "";
    txtEmail2.value = "";
    txtPassword2.value = "";
    
}

function signUp(event) {
    console.log("bbb");
    
    var email = txtEmail2.value;
    var password = txtPassword2.value;
    
    console.log(email);
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(e => console.log(e.message)).then(function(){
        //登入成功後，取得登入使用者資訊

        loginUser = firebase.auth().currentUser;
        console.log("登入使用者為",loginUser);
        firebase.database().ref('users/' + loginUser.uid).update({
        email: loginUser.email,
        name: userName.value,
        
        }).catch(function(error){
            console.error("寫入使用者資訊錯誤",error);
        });
        txtEmail.value = "";
        txtPassword.value = "";
        txtEmail2.value = "";
        txtPassword2.value = "";
        loginUser.updateProfile({
            displayName: userName.value
        })
        location.reload();
    });
    show("loginBox");
    hide("signUpBox");

}

    






var signoutSmtBtn = document.getElementById("btnSignOut");
signoutSmtBtn.addEventListener("click",function(){
    firebase.auth().signOut().then(function() {
        logoutChange();
        console.log("User sign out!");
    }, function(error) {
    console.log("User sign out error!");
    })
},false);

var usr;
var userLogin;
var ashow = document.getElementById("ashow");

firebase.auth().onAuthStateChanged(function(user) {
    
  if (user) {
    
      console.log(user.photoURL);
      if (user.photoURL)
        userPhoto.style.backgroundImage = "url(" + user.photoURL + ")";
        else userPhoto.style.backgroundImage = "url(../img/userPhoto.jpg)";
    $("#history").empty();
    $("#ashow").empty();
    $('.collapse').collapse("hide");
    refreshFR();
    refreshFL();
    console.log("asd");
    userLogin = user;
    usr = firebase.database().ref().child('users/' + firebase.auth().currentUser.uid);
    usrFriends = usr.child('friends');
    
    usrFriends.on("value", function(snapshot) {
        console.log(snapshot.val());
    });

    var database = firebase.database().ref('users/').orderByChild('name'); //前面介紹那些order、limit都可以用
    database.once('value', function(snapshot){
        var count;
        snapshot.forEach(function(childSnapshot) {
            count++;
            var name = childSnapshot.val().name;
            var div = document.createElement("DIV");        
                
            var url;
            var imgDiv = document.createElement("DIV"); 
            var t = document.createElement("DIV");  
            t.innerHTML = name;
            if (childSnapshot.val().photoURL) imgDiv.style.backgroundImage = "url("+ childSnapshot.val().photoURL +")";
            else imgDiv.style.backgroundImage = "url(../img/userPhoto.jpg)";
            div.appendChild(imgDiv);      
            div.appendChild(t);                                // Append the text to <button>
            ashow.appendChild(div);
            t.setAttribute("class","t");
            imgDiv.setAttribute("class","friendImg");
            div.setAttribute("data-toggle","modal");
            div.setAttribute("data-target","#exampleModal");
            div.setAttribute("class","eachLine");
            div.setAttribute("id","allUser" + childSnapshot.key);
            //var idsent = div.id.split("allUser")[1];
            console.log(div.id);
            div.addEventListener('click', function(event){openModal(event, div.id);});
            //div.setAttribute("onclick","openModal(" + div.id + ")");
            //ashow.innerHTML = childSnapshot.val().name;
        });
        if (count == 0) {
            var emptyDiv = document.createElement("DIV");
            emptyDiv.style.backgroundImage = "url(../img/noU.png)";
            emptyDiv.setAttribute("class","emptyDiv");
            emptyDiv.setAttribute("id","emptyDivU");
            ashow.appendChild(emptyDiv);
        }
    });

    loginChange(user);
    
    console.log("User is logined", user)
  } else {
    userLogin = null;
    console.log("User is not logined yet.");
  }
});
/*
usrFriends.orderByKey().on("child_changed", function(snapshot) {
    console.log("friends" + snapshot.key());
});*/

function openModalrequest(event, a) {
    console.log(a);
    
    var UI = a.split("FR")[1];
    var database = firebase.database().ref("users/" + UI);
    var txt;

    hide("btnAddFriend");
    show("btnAcceptFR");

    database.once('value', function(snapshot){
        var url;
        txt = snapshot.val().name;
        console.log(txt);
        $("#modalTitle").text(txt);
        if (snapshot.val().photoURL) url = "url(" + snapshot.val().photoURL + ")";
        else url = "url(../img/userPhoto.jpg)";
        modalPic.style.backgroundImage = url;
    });
    toBeFriend = UI;
    //var text = JSON.stringify(txt);
}
function openModal(event, a) {
    console.log(a);
    var friendDB = firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/friends/");
    var UI = a.split("allUser")[1];
    var database = firebase.database().ref("users/" + UI);
    var txt;
    var frdb = firebase.database().ref("friendRequests/" + UI);
    
    database.once('value', function(snapshot){
        var url;
        txt = snapshot.val().name;
        console.log(txt);
        $("#modalTitle").text(txt);
        if (snapshot.val().photoURL) url = "url(" + snapshot.val().photoURL + ")";
        else url = "url(../img/userPhoto.jpg)";
        modalPic.style.backgroundImage = url;
    });
    requestFriend = UI;

    

    friendDB.once('value', function(snapshot){
        if (!snapshot.hasChild(UI) && UI != firebase.auth().currentUser.uid) {
            show("btnAddFriend");
        }
        else hide("btnAddFriend");
    });
    frdb.once('value', function(snapshot){
        snapshot.forEach(function(childSnapshot) {
            if (childSnapshot.val().sender == firebase.auth().currentUser.uid) {
                hide("btnAddFriend");
            }
               
        });
        
    });

    
    hide("btnAcceptFR");

    
    //var text = JSON.stringify(txt);
}

$("#btnLogin").submit(function(){
    return false;
})

$("#loginForm").submit(function(){
    return false;
})

function loginChange() {
    hide("landingPage");
    show("wrapper");
    openFriend();    
    if (firebase.auth().currentUser.photoURL)
    userPhoto.style.backgroundImage = "url(" + firebase.auth().currentUser.photoURL + ")";
    else userPhoto.style.backgroundImage = "url(../img/userPhoto.jpg)";
    console.log("done");
    
}

function logoutChange() {
    show("landingPage");
    hide("wrapper");
}




function show(id) {
    if (document.getElementById) {
      var divid = document.getElementById(id);
      $(divid).fadeIn("fast");
      
    }
    return false;
}
function hide(id) {
    if (document.getElementById) {
      var divid = document.getElementById(id);
      $(divid).fadeOut("fast");
      console.log("hide");
    }
    return false;
}