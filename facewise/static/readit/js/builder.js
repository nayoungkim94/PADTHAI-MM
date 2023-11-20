var dataset;
var base_url = 'http://127.0.0.1:8080' // 'https://analog-height-296717.uc.r.appspot.com' // '
var top_tweet = '';
var data_date_ranges = [new Date(3000, 1, 1), new Date(1800, 1, 1)];

// information about data collection
var date_info = '';

document.addEventListener('DOMContentLoaded', function() {
    $('#num_sents').attr('disabled', 'disabled');

    // read tweets from a random user and show on the UI
    Promise.all([d3.json(base_url + '/read_data')]).then(function(data) {
        $.LoadingOverlay('show');

        dataset = data[0];
        console.log(dataset.length);
        console.log(dataset[0]);

        // sort the dataset based on popularity
        dataset.sort((a, b) => {
            return a.popularity < b.popularity;
        });

        top_tweet = dataset[0];

        // add items
        for(let i=0; i<dataset.length; i++) {
            if(dataset[i].dtype == 'tweet')
                $('.info-div').append(`<div class="h-1 p-3 bg-light border rounded-2" style="margin: 5px;"><p align="left"><strong>` + dataset[i].username + `</strong></p><p align="left">` + dataset[i].text + `</p><p align="left"><small>Created at: ` + dataset[i].date + `</small></p></div>`);
            else
                $('.info-div').append(`<div class="h-1 p-3 bg-light border rounded-2" style="margin: 5px;"><p align="left"><strong>` + dataset[i].username + `</strong></p><p align="left"><strong>` + dataset[i].title + `</strong></p><p align="left">` + dataset[i].text + `</p><p align="left"><small>Created at: ` + dataset[i].date + `</small></p></div>`);

            // find the date ranges
            if (data_date_ranges[0] > new Date(dataset[i].date)) {
                data_date_ranges[0] = new Date(dataset[i].date);
            }

            if (data_date_ranges[1] < new Date(dataset[i].date)) {
                data_date_ranges[1] = new Date(dataset[i].date);
            }

        }

        // update the extra info
        $('#summary-extra-info').html(dataset.length + ' pieces of content, 5 results shown per group');

        // update date info -> info modal 
        date_info = '<p>Most Influential Content</p><p>Date Published: ' + new Date(top_tweet.date).toISOString().split('T')[0] + '</p></ br><p>Extractive Summary</p><p>Date Range: ' + data_date_ranges[0].toISOString().split('T')[0] + ' - ' + data_date_ranges[1].toISOString().split('T')[0] + '</p>';

    });

    Promise.all([d3.json(base_url + '/get_summary?limit=5')]).then(function(data) {
        // add items
        $('.info-summary').html(`<h6>Most Influential Content:</h6><p>` + top_tweet.text + `</p><h6>Extractive Summary:</h6><p align="left">` + data[0][0].result + `</p>`)
        $('#num_sents').removeAttr('disabled');

        $.LoadingOverlay('hide');
    });

    $('#get_data_btn').click(function() {
        // get new data
        $.LoadingOverlay("show");

        Promise.all([d3.json(base_url + '/get_new_data?tags=' + input.value)]).then(function(data) {

            if(data[0] == 'OK') {
                // update the results
                $('.info-div').html('');
                Promise.all([d3.json(base_url + '/read_data')]).then(function(data) {
                    dataset = data[0];
                    
                    dataset.sort((a, b) => {
                        return a.popularity < b.popularity;
                    });
            
                    top_tweet = dataset[0];

                    // add items
                    for(let i=0; i<dataset.length; i++) {
                        if(dataset[i].dtype == 'tweet')
                            $('.info-div').append(`<div class="h-1 p-3 bg-light border rounded-3" style="margin: 10px;"><p align="left"><strong>` + dataset[i].username + `</strong></p><p align="left">` + dataset[i].text + `</p><p align="left"><small>Created at: ` + dataset[i].date + `</small></p></div>`);
                        else
                            $('.info-div').append(`<div class="h-1 p-3 bg-light border rounded-3" style="margin: 10px;"><p align="left"><strong>` + dataset[i].username + `</strong></p><p align="left"><strong>` + dataset[i].title + `</strong></p><p align="left">` + dataset[i].text + `</p><p align="left"><small>Created at: ` + dataset[i].date + `</small></p></div>`);

                        // find the date ranges
                        if (data_date_ranges[0] > new Date(dataset[i].date)) {
                            data_date_ranges[0] = new Date(dataset[i].date);
                        }

                        if (data_date_ranges[1] < new Date(dataset[i].date)) {
                            data_date_ranges[1] = new Date(dataset[i].date);
                        }
                    }
                });

                // update the extra info
                $('#summary-extra-info').html(dataset.length + ' pieces of content, 5 results shown per group');

                // update date info -> info modal 
                date_info = '<p>Most Influential Content</p><p>Date Published: ' + new Date(top_tweet.date).toISOString().split('T')[0] + '</p></ br><p>Extractive Summary</p><p>Date Range: ' + data_date_ranges[0].toISOString().split('T')[0] + ' - ' + data_date_ranges[1].toISOString().split('T')[0] + '</p>';

                // update summary
                Promise.all([d3.json(base_url + '/get_summary?limit=5')]).then(function(data) {
                    $('.info-summary').html(`<h6>Most Influential Content:</h6><p>` + top_tweet.text + `</p><h6>Extractive Summary:</h6><p align="left">` + data[0][0].result + `</p>`)
                });

                $.LoadingOverlay("hide");
            }
            else{
                alert('Error!');
            }
        });
    });

});
