var cascadingSlotGameResult = (function () {
    var userNumberElements = document.querySelector('#result-container');
    var userNumberElementTemplate = document.querySelector('template');
    var index = 0;
    return {
        addTumble: function () {
            var elementClone = userNumberElementTemplate.content.cloneNode(true);
            elementClone.querySelector('span').textContent = index === 0 ? 'Base Spin' : 'Tumbling ' + index;

            userNumberElements.appendChild(elementClone);
            index++;
        },
        submit: function (e) {
            e.preventDefault();

            var results = [];
            $(".result-raw").each(function (index) {
                results.push($(this).val());
            });

            console.log(results);
        }
    };
})();

$(document).ready(function () {
    cascadingSlotGameResult.addTumble();
}) 