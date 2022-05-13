var cascadingSlotGameResultBase = (function () {
    var resultContainer = document.querySelector('#result-container');
    var template = document.querySelector('template');
    var index = 0;
    return {
        onInputNickname: function (event) {
            event.preventDefault();
            if (event.currentTarget.value !== "") {
                $('.error').addClass('hidden');
            }
        },
        addTumble: function () {
            $('#result-container').find('.add-tumble').remove();
            var elementClone = template.content.cloneNode(true);
            elementClone.querySelector('span').textContent = index === 0 ? 'Base Spin' : 'Tumbling ' + index;

            resultContainer.appendChild(elementClone);
            index++;
        }
    };
})();


$(document).ready(function () {
    cascadingSlotGameResult.addTumble();

    var navbarElm = $('#navbar');
    var containerElm = $('.inner-content');
    var headerElm = $('.header');
    var stickyOffset = navbarElm.offset().top;
    var headerHeight = $('.header').height();
    var originContainerHeight = containerElm.height();

    containerElm.scroll(function () {
        var scroll = containerElm.scrollTop();

        if (scroll >= stickyOffset - 50) {
            containerElm.height(originContainerHeight + headerHeight);
            navbarElm.addClass('fixed');
            headerElm.addClass('hidden');
        }
        else {
            containerElm.height(originContainerHeight);
            navbarElm.removeClass('fixed');
            headerElm.removeClass('hidden');
        }
    });
}) 