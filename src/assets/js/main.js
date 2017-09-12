$(document).ready();

$('body').on('focusin', function() {
    console.log(document.activeElement);
  });