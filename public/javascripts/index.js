$(function() {
    $('.del-cart').on('click', function() {
        console.log($(this).attr('__val'));
        $.ajax({
            type: "delete", 
            url: "/cart/delete",
            data: JSON.stringify({id: $(this).attr('__val')}),
            dataType: "json",
            contentType: 'application/json; charset=UTF-8',
            crossDomain: true
        })
        .done(function(res) {
            location.reload();
        })
        .fail(function() {
            console.log("Could not delete item from cart");
        })
    });
    $('#item-image').on('change', function(e) {
        input = e.target;
        if (input.files && input.files[0]) {

            var reader = new FileReader();
            reader.onload = function(e) {
                $('#uploaded_img')
                    .attr('src', e.target.result);
                console.log(e.target.result);
            };
            reader.readAsDataURL(input.files[0]);
        }
    });
    // $('#edit-item-form').submit(function(e) {
    //     e.preventDefault();
    //     console.log(e);
    // })
})