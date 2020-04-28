var userCityChoices = [];

//on click to add user input intouserCityChoices array
$('#submit-search').on('click', function(event) {
    event.preventDefault();

    var cityInput = $('#user-search-input').val();
    userCityChoices.push(cityInput)

    renderList()
})

//renders the buttons in the list after user searches
function renderList() {
    $("#user-search-list").empty();
    for (var i = 0; i < userCityChoices.length; i++) {
        var cityButton = $('<button>');
        cityButton.addClass('list-group-item list-group-item-action');
        cityButton.attr('data-name', userCityChoices[i]);
        cityButton.text(userCityChoices[i]);
        $('#user-search-list').prepend(cityButton)
    }
}