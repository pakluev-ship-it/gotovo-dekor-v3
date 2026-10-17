$(document).ready(function() {

  // Portfolio filters
  $('.portfolio-section__filter').on('click', function() {
    var $this = $(this);
    var filterValue = $this.text().trim();

    // Update active state
    $('.portfolio-section__filter').removeClass('portfolio-section__filter--active');
    $('.portfolio-section__filter').attr('aria-pressed', 'false');
    $this.addClass('portfolio-section__filter--active');
    $this.attr('aria-pressed', 'true');

    // Filter cards
    if (filterValue === 'Все работы') {
      $('.portfolio-section__card').show();
    } else {
      $('.portfolio-section__card').each(function() {
        var $card = $(this);
        var badge = $card.find('.portfolio-section__badge').text().trim();

        if (badge === filterValue ||
            (filterValue === 'Квартиры' && badge === 'Квартира') ||
            (filterValue === 'Дома' && badge === 'Дом') ||
            (filterValue === 'Офисы' && badge === 'Офис') ||
            (filterValue === 'Фасады' && badge === 'Фасад')) {
          $card.show();
        } else {
          $card.hide();
        }
      });
    }
  });

});
