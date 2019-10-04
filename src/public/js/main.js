
$(function () {
    const socket = io();
    //obtaining DOM elements from the interface
    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');

    //obtaining DOM elements from the nickNameForm
    const $nickForm = $('#nickForm');
    const $nickError = $('#nickError');
    const $nickName = $('#nickName');
    const $users = $('#usernames');

    $nickForm.submit(e => {
        e.preventDefault();
        socket.emit('New User', $nickName.val(), data => {
            if (data) {
                $('#nickWrap').hide();
                $('#contentWrap').show();
            } else {
                $nickError.html(`
                <div class="alert-danger">
                That user already exist
                </div>
                `);
            }
            $nickName.val(' ');
        });
    });

    //events
    $messageForm.submit(e => {
        e.preventDefault();
        socket.emit('Send message', $messageBox.val(), data => {
            $chat.append(`<p class="error ">${data}</p>`)
        });
        $messageBox.val('');
    });

    socket.on('New messages', data => {
        $chat.append('<b>' + data.nick + '</b>: ' + data.msg + '<br/>');
    });

    socket.on('usernames', data => {
        let html = '';
        for (let i = 0; i < data.length; i++) {
            html += `<p><i class="fas fa-user"></i> ${data[i]}</p>`
        }
        $users.html(html);
    });

    socket.on('whisper', data => {
        $chat.append(`<p class="whisper"><b>${data.nick}:</b> ${data.msg}</p>`)
    });

    socket.on('load old msg', msgs => {
        for (let i = 0; i < msgs.length; i++) {
            console.log('all msgs', msgs[i])
            displayMsg(msgs[i]);
        }
    })

    function displayMsg(data) {
        $chat.append(`<p class="whisper"><b>${data.nick}:</b> ${data.msg}</p>`);
    }
});