import Spinner from 'spin';

Template.loading.onRendered(() => {
    const options = {
        lines: 17,                                                              // The number of lines to draw
        length: 0,                                                             // The length of each line
        width: 8,                                                              // The line thickness
        radius: 30,                                                             // The radius of the inner circle
        scale: 5,                                                               // Scales overall size of the spinner
        corners: 1,                                                             // Corner roundness (0..1)
        color: '#000',                                                       // #rgb or #rrggbb or array of colors
        opacity: 0.05,                                                          // Opacity of the lines
        rotate: 0,                                                              // The rotation offset
        direction: 1,                                                           // 1: clockwise, -1: counterclockwise
        speed: 1.2,                                                               // Rounds per second
        trail: 50,                                                              // Afterglow percentage
        fps: 60,                                                                // Frames per second when using setTimeout() as a fallback for CSS
        zIndex: 2e9,                                                            // The z-index (defaults to 2000000000)
        className: 'spinner',                                                   // The CSS class to assign to the spinner
        top: '50%',                                                             // Top position relative to parent
        left: '50%',                                                            // Left position relative to parent
        shadow: false,                                                          // Whether to render a shadow
        hwaccel: true,                                                          // Whether to use hardware acceleration
        position: 'absolute'                                                    // Element positioning
    };

    const target = document.getElementById('spinner');
    const spinner = new Spinner(options).spin(target);
});