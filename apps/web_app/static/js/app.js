var post_main_addr = 'http://cannadvise.me' //'http://35.161.235.42:10001'; // address with flask api

function load_main() {
    console.log('loading...');
    $('.page-wrap').load('./main.html', complete = function() {
        // when the words are clicked, toggle their active state
        $('.list-group-item').click(function() {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
            } else {
                $(this).addClass('active');
            }
        });
        $.post(post_main_addr + '/get_product_words', function(data, err) {
            words = $.parseJSON(data);
            categories = Object.keys(words);
            var num_cats = categories.length;
            setWords();
        });
    }).hide().fadeIn(); // fade in the content
}

window.onload = load_main();
//window.onresize = ;

// http://stackoverflow.com/questions/6630772/javascript-pop-from-object
var ObjectStack = function(obj) {
    this.object = obj;
    this.stack = [];
};

ObjectStack.prototype.pop = function() {
    var key = this.stack.pop();
    var prop = this.object[key];
    delete this.object[key];
    return prop;
};

// http://stackoverflow.com/questions/12987719/javascript-how-to-randomly-sample-items-without-replacement
function getRandomFromBucket() {
    var randomIndex = Math.floor(Math.random() * bucket.length);
    return bucket.splice(randomIndex, 1)[0];
}

var bucket;

function getRandomElements(lest, n = 3) {
    // takes in a list and returns n random elements
    // without replacement
    bucket = [];
    var returnlest = [];

    for (var i = 0; i <= lest.length - 1; i++) {
        bucket.push(i);
    }

    for (var i = 0; i <= n; i++) {
        returnlest.push(lest[getRandomFromBucket()]);
    }

    return returnlest;

}

// load words for making recommendation when that section has loaded
var words, rows, categories, rand;
$('#words').ready(function() {
    $.post(post_main_addr + '/get_product_words', function(data, err) {
        words = $.parseJSON(data);
        categories = Object.keys(words);
        var num_cats = categories.length;
        setWords();
    });
});

function setWords() {
    // sets words in the list groups
    cats = getRandomElements(categories, $('.list-group').length);
    $('.list-group').each(function(i, v) {
        rows = $(v).children();
        rows[0].innerHTML = cats[i];
        word_samp = getRandomElements(words[cats[i]]);
        rows.slice(1).each(function(i, e) {
            e.innerHTML = word_samp[i];
        });
    });
}

function parse_recs(recs) {
    $(recs).each(function(i, e, a) {

    });
}

function recommend(chosen_words, callback = null) {
    $.post(post_main_addr + '/send_words', data = {
        word_list: chosen_words
    }, function(data, err) {
        console.log(data);
        recs = JSON.parse(data)['recs'];
        var recText = parse_recs(recs);
        $('.list-group-item').each(function(i, v) {
            $(v).text(recs[i].replace(/-/, ' '));
            console.log(recs[i]);
        });
    });
    if (callback) {
        console.log('doing callback');
        callback(recs);
    }
}

var chosen_words = [],
    recs;

function get_chosen_words() {
    $('.list-group-item').each(function(i, v) {
        if ($(v).hasClass('active')) {
            var text = v.innerHTML;
            console.log(text);
            chosen_words.push(text);
        }
    });
}

//force not to cache so we can update pages
$.ajaxSetup({
    // Disable caching of AJAX responses
    cache: false
});

// navigation actions
$('#explore').click(function() {
    get_chosen_words();
    console.log(chosen_words);
    $('#landing').fadeOut(function() {
        // make recommendation
        $('.page-wrap').load('rec_body.html', complete = function() {
            recommend(chosen_words);
        });
    });

});

$('#home').click(function() {
    load_main();
});

$('#refresh').click(function() {
    get_chosen_words();
    console.log(chosen_words);
    $('#landing').fadeOut(function() {
        load_main();
    });
});