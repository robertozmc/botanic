notify = function (type, header, message) {
    const timestamp = new Date().getTime();
    $('#notifications').append(
        `<div class="ui ${type} hidden message" id="${timestamp}">
            <i class="close icon"></i>
            <div class="header">
                ${header}
            </div>
            ${message}
        </div>`
    );

    $(`#${timestamp}`).transition('vertical flip', '500ms');

    $(`#${timestamp} .close`).on('click', function() {
        $(`#${timestamp}`).transition('vertical flip', '500ms');
        setTimeout(function() {
            $(`#${timestamp}`).remove();
        }, 500);
    });

    setTimeout(function() {
        $(`#${timestamp}`).transition('vertical flip', '500ms');
        setTimeout(function() {
            $(`#${timestamp}`).remove();
        }, 500);
    }, 5000);
};

Template.alertsSidebar.onRendered(() => {
    $('.ui.sticky').sticky({
        silent: true
    });
});