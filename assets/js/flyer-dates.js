/**
 * Weekly flyer validity: Friday through the following Thursday (7 days).
 * Updates every element with class .js-flyer-valid-range to "Valid Mon D – Mon D, YYYY".
 */
(function () {
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function flyerWeekBounds(today) {
    var d = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    var day = d.getDay();
    var daysFromFriday = (day + 7 - 5) % 7;
    var start = new Date(d);
    start.setDate(d.getDate() - daysFromFriday);
    var end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { start: start, end: end };
  }

  function formatRange(start, end) {
    var sy = start.getFullYear();
    var sm = start.getMonth();
    var sd = start.getDate();
    var ey = end.getFullYear();
    var em = end.getMonth();
    var ed = end.getDate();
    if (sy === ey && sm === em) {
      return MONTHS[sm] + ' ' + sd + ' \u2013 ' + ed + ', ' + sy;
    }
    if (sy === ey) {
      return MONTHS[sm] + ' ' + sd + ' \u2013 ' + MONTHS[em] + ' ' + ed + ', ' + sy;
    }
    return MONTHS[sm] + ' ' + sd + ', ' + sy + ' \u2013 ' + MONTHS[em] + ' ' + ed + ', ' + ey;
  }

  function validLabel(today) {
    var b = flyerWeekBounds(today);
    return 'Valid ' + formatRange(b.start, b.end);
  }

  function apply() {
    var text = validLabel(new Date());
    var nodes = document.querySelectorAll('.js-flyer-valid-range');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = text;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
