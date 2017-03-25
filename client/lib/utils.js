// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - C L I E N T   U T I L S - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

jQuery.fn.extend({
    insertAtCaret: function(myValue) {
        return this.each(function(i) {
            if (document.selection) {
                //For browsers like Internet Explorer
                this.focus();
                var sel = document.selection.createRange();
                sel.text = myValue;
                this.focus();
            } else if (this.selectionStart || this.selectionStart == '0') {
                //For browsers like Firefox and Webkit based
                var startPos = this.selectionStart;
                var endPos = this.selectionEnd;
                var scrollTop = this.scrollTop;
                this.value = this.value.substring(0, startPos) + myValue + this.value.substring(endPos, this.value.length);
                this.focus();
                this.selectionStart = startPos + myValue.length;
                this.selectionEnd = startPos + myValue.length;
                this.scrollTop = scrollTop;
            } else {
                this.value += myValue;
                this.focus();
            }
        });
    }
});

(function($) {
    $.fn.goTo = function() {
        $('html, body').animate({
            scrollTop: $(this).offset().top + 'px'
        }, 'slow');
        return this; // for chaining...
    };
})(jQuery);

export const formatDate = date => {
    return date ? moment(date).format('DD.MM.YYYY') : 'Brak';
};

export const getNumberOfPages = (pageType, limit) => {
    let lastPage = Counter.get(`${pageType}Count`) / limit;

    if (!Number.isInteger(lastPage)) {
        lastPage = parseInt(lastPage) + 1;
    }

    return lastPage;
};

export const stringToBoolean = string => {
    let value;

    if (string === 'true') {
        value = true;
    } else if (string === 'false') {
        value = false;
    } else {
        value = null;
    }

    return value;
};

export const formatNewsTextToSave = text => {
    text = text.replace(/\n/g, '<br>');
    text = text.replace(/<\/h1><br>/g, '</h1>');
    text = text.replace(/<\/h2><br>/g, '</h2>');
    text = text.replace(/<\/h3><br>/g, '</h3>');
    text = text.replace(/<\/h4><br>/g, '</h4>');
    text = text.replace(/<\/h5><br>/g, '</h5>');
    text = text.replace(/<\/h6><br>/g, '</h6>');
    text = text.replace(/<div><br>/g, '<div>');
    text = text.replace(/<\/div><br>/g, '</div>');
    text = text.replace(/<p><br>/g, '<p>');
    text = text.replace(/<\/p><br>/g, '</p>');
    text = text.replace(/<ol><br>/g, '<ol>');
    text = text.replace(/<\/ol><br>/g, '</ol>');
    text = text.replace(/<ul><br>/g, '<ul>');
    text = text.replace(/<\/ul><br>/g, '</ul>');
    text = text.replace(/<li><br>/g, '<li>');
    text = text.replace(/<\/li><br>/g, '</li>');

    return text;
};

export const formatNewsTextToShow = text => {
    text = text.replace(/<br>/g, '\n');
    text = text.replace(/<\/h1>/g, '</h1>\n');
    text = text.replace(/<\/h2>/g, '</h2>\n');
    text = text.replace(/<\/h3>/g, '</h3>\n');
    text = text.replace(/<\/h4>/g, '</h4>\n');
    text = text.replace(/<\/h5>/g, '</h5>\n');
    text = text.replace(/<\/h6>/g, '</h6>\n');
    text = text.replace(/<div>/g, '<div>\n');
    text = text.replace(/<\/div>/g, '</div>\n');
    text = text.replace(/<p>/g, '<p>\n');
    text = text.replace(/<\/p>/g, '</p>\n');
    text = text.replace(/<ol>/g, '<ol>\n');
    text = text.replace(/<\/ol>/g, '</ol>\n');
    text = text.replace(/<ul>/g, '<ul>\n');
    text = text.replace(/<\/ul>/g, '</ul>\n');
    text = text.replace(/<li>/g, '<li>\n');
    text = text.replace(/<\/li>/g, '</li>\n');

    return text;
};

// Format division database string to pretty string
export const formatDivision = string => {
    switch (string) {
        case 'angiosperm':
            return 'Okrytonasienne';
        case 'gymnosperm':
            return 'Nagonasienne';
        default:
            return null;
    }
};

// Format clade database string to pretty string
export const formatClade = string => {
    switch (string) {
        case 'monocotyledon':
            return 'Jednoliścienne';
        case 'dicotyledon':
            return 'Dwuliścienne';
        default:
            return null;
    }
};

// Format type database string to pretty string
export const formatType = string => {
    switch (string) {
        case 'tree':
            return 'Drzewo';
        case 'shrub':
            return 'Krzew';
        case 'littleShrub':
            return 'Krzewinka';
        case 'annualVine':
            return 'Pnącze jednoroczne';
        case 'perennialVine':
            return 'Pnącze wieloletnie';
        case 'perennial':
            return 'Bylina';
        case 'annunal':
            return 'Roślina jednoroczna';
        case 'biennial':
            return 'Roślina dwuletnia';
        default:
            return 'Nieznany typ';
    }
};

// Format type of protection database string to pretty string
export const formatTypeOfProtection = string => {
    switch (string) {
        case 'fullProtection':
            return 'Ochrona ścisła';
        case 'partialProtection':
            return 'Ochrona częściowa';
        case 'noProtection':
            return 'Brak ochrony';
        default:
            return null;
    }
};

// Format import type database string to pretty string
export const formatImportType = string => {
    switch (string) {
        case 'seeds':
            return 'Nasiona';
        case 'seedlings':
            return 'Sadzonka';
        default:
            return null;
    }
};

// TODO: Nazwy państw potrzebne do dropdown'a podczas zamawiania nasion i dodawania ogrodu botanicznego

// content = [
//     { title: 'Andorra' },
//     { title: 'United Arab Emirates' },
//     { title: 'Afghanistan' },
//     { title: 'Antigua' },
//     { title: 'Anguilla' },
//     { title: 'Albania' },
//     { title: 'Armenia' },
//     { title: 'Netherlands Antilles' },
//     { title: 'Angola' },
//     { title: 'Argentina' },
//     { title: 'American Samoa' },
//     { title: 'Austria' },
//     { title: 'Australia' },
//     { title: 'Aruba' },
//     { title: 'Aland Islands' },
//     { title: 'Azerbaijan' },
//     { title: 'Bosnia' },
//     { title: 'Barbados' },
//     { title: 'Bangladesh' },
//     { title: 'Belgium' },
//     { title: 'Burkina Faso' },
//     { title: 'Bulgaria' },
//     { title: 'Bahrain' },
//     { title: 'Burundi' },
//     { title: 'Benin' },
//     { title: 'Bermuda' },
//     { title: 'Brunei' },
//     { title: 'Bolivia' },
//     { title: 'Brazil' },
//     { title: 'Bahamas' },
//     { title: 'Bhutan' },
//     { title: 'Bouvet Island' },
//     { title: 'Botswana' },
//     { title: 'Belarus' },
//     { title: 'Belize' },
//     { title: 'Canada' },
//     { title: 'Cocos Islands' },
//     { title: 'Congo' },
//     { title: 'Central African Republic' },
//     { title: 'Congo Brazzaville' },
//     { title: 'Switzerland' },
//     { title: 'Cote Divoire' },
//     { title: 'Cook Islands' },
//     { title: 'Chile' },
//     { title: 'Cameroon' },
//     { title: 'China' },
//     { title: 'Colombia' },
//     { title: 'Costa Rica' },
//     { title: 'Serbia' },
//     { title: 'Cuba' },
//     { title: 'Cape Verde' },
//     { title: 'Christmas Island' },
//     { title: 'Cyprus' },
//     { title: 'Czech Republic' },
//     { title: 'Germany' },
//     { title: 'Djibouti' },
//     { title: 'Denmark' },
//     { title: 'Dominica' },
//     { title: 'Dominican Republic' },
//     { title: 'Algeria' },
//     { title: 'Ecuador' },
//     { title: 'Estonia' },
//     { title: 'Egypt' },
//     { title: 'Western Sahara' },
//     { title: 'Eritrea' },
//     { title: 'Spain' },
//     { title: 'Ethiopia' },
//     { title: 'European Union' },
//     { title: 'Finland' },
//     { title: 'Fiji' },
//     { title: 'Falkland Islands' },
//     { title: 'Micronesia' },
//     { title: 'Faroe Islands' },
//     { title: 'France' },
//     { title: 'Gabon' },
//     { title: 'England' },
//     { title: 'Grenada' },
//     { title: 'Georgia' },
//     { title: 'French Guiana' },
//     { title: 'Ghana' },
//     { title: 'Gibraltar' },
//     { title: 'Greenland' },
//     { title: 'Gambia' },
//     { title: 'Guinea' },
//     { title: 'Guadeloupe' },
//     { title: 'Equatorial Guinea' },
//     { title: 'Greece' },
//     { title: 'Sandwich Islands' },
//     { title: 'Guatemala' },
//     { title: 'Guam' },
//     { title: 'Guinea-Bissau' },
//     { title: 'Guyana' },
//     { title: 'Hong Kong' },
//     { title: 'Heard Island' },
//     { title: 'Honduras' },
//     { title: 'Croatia' },
//     { title: 'Haiti' },
//     { title: 'Hungary' },
//     { title: 'Indonesia' },
//     { title: 'Ireland' },
//     { title: 'Israel' },
//     { title: 'India' },
//     { title: 'Indian Ocean Territory' },
//     { title: 'Iraq' },
//     { title: 'Iran' },
//     { title: 'Iceland' },
//     { title: 'Italy' },
//     { title: 'Jamaica' },
//     { title: 'Jordan' },
//     { title: 'Japan' },
//     { title: 'Kenya' },
//     { title: 'Kyrgyzstan' },
//     { title: 'Cambodia' },
//     { title: 'Kiribati' },
//     { title: 'Comoros' },
//     { title: 'Saint Kitts and Nevis' },
//     { title: 'North Korea' },
//     { title: 'South Korea' },
//     { title: 'Kuwait' },
//     { title: 'Cayman Islands' },
//     { title: 'Kazakhstan' },
//     { title: 'Laos' },
//     { title: 'Lebanon' },
//     { title: 'Saint Lucia' },
//     { title: 'Liechtenstein' },
//     { title: 'Sri Lanka' },
//     { title: 'Liberia' },
//     { title: 'Lesotho' },
//     { title: 'Lithuania' },
//     { title: 'Luxembourg' },
//     { title: 'Latvia' },
//     { title: 'Libya' },
//     { title: 'Morocco' },
//     { title: 'Monaco' },
//     { title: 'Moldova' },
//     { title: 'Montenegro' },
//     { title: 'Madagascar' },
//     { title: 'Marshall Islands' },
//     { title: 'MacEdonia' },
//     { title: 'Mali' },
//     { title: 'Burma' },
//     { title: 'Mongolia' },
//     { title: 'MacAu' },
//     { title: 'Northern Mariana Islands' },
//     { title: 'Martinique' },
//     { title: 'Mauritania' },
//     { title: 'Montserrat' },
//     { title: 'Malta' },
//     { title: 'Mauritius' },
//     { title: 'Maldives' },
//     { title: 'Malawi' },
//     { title: 'Mexico' },
//     { title: 'Malaysia' },
//     { title: 'Mozambique' },
//     { title: 'Namibia' },
//     { title: 'New Caledonia' },
//     { title: 'Niger' },
//     { title: 'Norfolk Island' },
//     { title: 'Nigeria' },
//     { title: 'Nicaragua' },
//     { title: 'Netherlands' },
//     { title: 'Norway' },
//     { title: 'Nepal' },
//     { title: 'Nauru' },
//     { title: 'Niue' },
//     { title: 'New Zealand' },
//     { title: 'Oman' },
//     { title: 'Panama' },
//     { title: 'Peru' },
//     { title: 'French Polynesia' },
//     { title: 'New Guinea' },
//     { title: 'Philippines' },
//     { title: 'Pakistan' },
//     { title: 'Poland' },
//     { title: 'Saint Pierre' },
//     { title: 'Pitcairn Islands' },
//     { title: 'Puerto Rico' },
//     { title: 'Palestine' },
//     { title: 'Portugal' },
//     { title: 'Palau' },
//     { title: 'Paraguay' },
//     { title: 'Qatar' },
//     { title: 'Reunion' },
//     { title: 'Romania' },
//     { title: 'Serbia' },
//     { title: 'Russia' },
//     { title: 'Rwanda' },
//     { title: 'Saudi Arabia' },
//     { title: 'Solomon Islands' },
//     { title: 'Seychelles' },
//     { title: 'Sudan' },
//     { title: 'Sweden' },
//     { title: 'Singapore' },
//     { title: 'Saint Helena' },
//     { title: 'Slovenia' },
//     { title: 'Svalbard, I Flag Jan Mayen' },
//     { title: 'Slovakia' },
//     { title: 'Sierra Leone' },
//     { title: 'San Marino' },
//     { title: 'Senegal' },
//     { title: 'Somalia' },
//     { title: 'Suriname' },
//     { title: 'Sao Tome' },
//     { title: 'El Salvador' },
//     { title: 'Syria' },
//     { title: 'Swaziland' },
//     { title: 'Caicos Islands' },
//     { title: 'Chad' },
//     { title: 'French Territories' },
//     { title: 'Togo' },
//     { title: 'Thailand' },
//     { title: 'Tajikistan' },
//     { title: 'Tokelau' },
//     { title: 'Timorleste' },
//     { title: 'Turkmenistan' },
//     { title: 'Tunisia' },
//     { title: 'Tonga' },
//     { title: 'Turkey' },
//     { title: 'Trinidad' },
//     { title: 'Tuvalu' },
//     { title: 'Taiwan' },
//     { title: 'Tanzania' },
//     { title: 'Ukraine' },
//     { title: 'Uganda' },
//     { title: 'Us Minor Islands' },
//     { title: 'United States' },
//     { title: 'Uruguay' },
//     { title: 'Uzbekistan' },
//     { title: 'Vatican City' },
//     { title: 'Saint Vincent' },
//     { title: 'Venezuela' },
//     { title: 'British Virgin Islands' },
//     { title: 'Us Virgin Islands' },
//     { title: 'Vietnam' },
//     { title: 'Vanuatu' },
//     { title: 'Wallis and Futuna' },
//     { title: 'Samoa' },
//     { title: 'Yemen' },
//     { title: 'Mayotte' },
//     { title: 'South Africa' },
//     { title: 'Zambia' },
//     { title: 'Zimbabwe' }
//   ];

// content = [
//     { title: 'Andora' },
//     { title: 'Zjednoczone Emiraty Arabskie' },
//     { title: 'Afganistan' },
//     { title: 'Antigua' },
//     { title: 'Anguilla' },
//     { title: 'Albania' },
//     { title: 'Armenia' },
//     { title: 'Antyle Holenderskie' },
//     { title: 'Angola' },
//     { title: 'Argentyna' },
//     { title: 'Samoa Amerykańskie' },
//     { title: 'Austria' },
//     { title: 'Australia' },
//     { title: 'Aruba' },
//     { title: 'Wyspy Alandzkie' },
//     { title: 'Azerbejdżan' },
//     { title: 'Bośnia i Hercegowina' },
//     { title: 'Barbados' },
//     { title: 'Bangladesz' },
//     { title: 'Belgia' },
//     { title: 'Burkina Faso' },
//     { title: 'Bułgaria' },
//     { title: 'Bahrajn' },
//     { title: 'Burundi' },
//     { title: 'Benin' },
//     { title: 'Bermuda' },
//     { title: 'Brunei' },
//     { title: 'Boliwia' },
//     { title: 'Brazylia' },
//     { title: 'Bahamy' },
//     { title: 'Bhutan' },
//     { title: 'Wyspa Bouveta' },
//     { title: 'Botswana' },
//     { title: 'Białoruś' },
//     { title: 'Belize' },
//     { title: 'Kanada' },
//     { title: 'Wyspy Kokosowe' },
//     { title: 'Demokratyczna Republika Konga' },
//     { title: 'Republika Środkowoafrykańska' },
//     { title: 'Kongo' },
//     { title: 'Szwajcaria' },
//     { title: 'Wybrzeże Kości Słoniowej' },
//     { title: 'Wyspy Cooka' },
//     { title: 'Chile' },
//     { title: 'Kamerun' },
//     { title: 'Chiny' },
//     { title: 'Kolumbia' },
//     { title: 'Kostaryka ' },
//     { title: 'Serbia' },
//     { title: 'Kuba' },
//     { title: 'Republika Zielonego Przylądka' },
//     { title: 'Wyspa Bożego Narodzenia' },
//     { title: 'Cypr' },
//     { title: 'Czechy' },
//     { title: 'Niemcy' },
//     { title: 'Dżibuti' },
//     { title: 'Dania' },
//     { title: 'Dominika' },
//     { title: 'Dominicana' },
//     { title: 'Algeria' },
//     { title: 'Ekwador' },
//     { title: 'Estonia' },
//     { title: 'Egipt' },
//     { title: 'Sahara Zachodnia' },
//     { title: 'Erytrea' },
//     { title: 'Hiszpania' },
//     { title: 'Etiopia' },
//     { title: 'Unia Europejska' },
//     { title: 'Finlandia' },
//     { title: 'Fidżi' },
//     { title: 'Falklandy' },
//     { title: 'Mikronezja' },
//     { title: 'Wyspy Owcze' },
//     { title: 'Francja' },
//     { title: 'Gabon' },
//     { title: 'Anglia' },
//     { title: 'Grenada' },
//     { title: 'Gruzja' },
//     { title: 'Gujana Francuska' },
//     { title: 'Ghana' },
//     { title: 'Gibraltar' },
//     { title: 'Grenlandia' },
//     { title: 'Gambia' },
//     { title: 'Gwinea' },
//     { title: 'Gwadelupa' },
//     { title: 'Gwinea Równikowas' },
//     { title: 'Grecja' },
//     { title: 'Hawaje' },
//     { title: 'Gwatemala' },
//     { title: 'Guam' },
//     { title: 'Gwinea Bissau' },
//     { title: 'Gujana' },
//     { title: 'Hong Kong' },
//     { title: 'Wyspy Heard i McDonalda' },
//     { title: 'Honduras' },
//     { title: 'Chorwacja' },
//     { title: 'Haiti' },
//     { title: 'Węgry' },
//     { title: 'Indonezja' },
//     { title: 'Irlandia' },
//     { title: 'Izrael' },
//     { title: 'Indie' },
//     { title: 'Brytyjskie Terytorium Oceanu Indyjskiego' },
//     { title: 'Irak' },
//     { title: 'Iran' },
//     { title: 'Islandia' },
//     { title: 'Włochy' },
//     { title: 'Jamajka' },
//     { title: 'Jordan' },
//     { title: 'Japonia' },
//     { title: 'Kenia' },
//     { title: 'Kirgistan' },
//     { title: 'Kambodża' },
//     { title: 'Kiribati' },
//     { title: 'Komory' },
//     { title: 'Saint Kitts and Nevis' },
//     { title: 'Korea Północna' },
//     { title: 'Korea Południowa' },
//     { title: 'Kuwejt' },
//     { title: 'Kajmany' },
//     { title: 'Kazachstan' },
//     { title: 'Laos' },
//     { title: 'Liban' },
//     { title: 'Saint Lucia' },
//     { title: 'Liechtenstein' },
//     { title: 'Sri Lanka' },
//     { title: 'Liberia' },
//     { title: 'Lesotho' },
//     { title: 'Litwa' },
//     { title: 'Luksemburg' },
//     { title: 'Łotwa' },
//     { title: 'Libia' },
//     { title: 'Maroko' },
//     { title: 'Monako' },
//     { title: 'Mołdawia' },
//     { title: 'Czarnogóra' },
//     { title: 'Madagaskar' },
//     { title: 'Wyspy Marshalla' },
//     { title: 'Macedonia' },
//     { title: 'Mali' },
//     { title: 'Birma' },
//     { title: 'Mongolia' },
//     { title: 'Makau' },
//     { title: 'Mariany Północne' },
//     { title: 'Martynika ' },
//     { title: 'Mauretania' },
//     { title: 'Montserrat' },
//     { title: 'Malta' },
//     { title: 'Mauritius' },
//     { title: 'Malediwy' },
//     { title: 'Malawi' },
//     { title: 'Meksyk' },
//     { title: 'Malezja' },
//     { title: 'Mozambik' },
//     { title: 'Namibia' },
//     { title: 'Nowa Kaledonia' },
//     { title: 'Niger' },
//     { title: 'Wyspa Norfolk' },
//     { title: 'Nigeria' },
//     { title: 'Nikaragua' },
//     { title: 'Holandia' },
//     { title: 'Norwegia' },
//     { title: 'Nepal' },
//     { title: 'Nauru' },
//     { title: 'Niue' },
//     { title: 'Nowa Zelandia' },
//     { title: 'Oman' },
//     { title: 'Panama' },
//     { title: 'Peru' },
//     { title: 'Polinezja Francuska' },
//     { title: 'Papua-Nowa Gwinea' },
//     { title: 'Filipiny' },
//     { title: 'Pakistan' },
//     { title: 'Polska' },
//     { title: 'Saint-Pierre i Miquelon' },
//     { title: 'Pitcairn' },
//     { title: 'Portoryko' },
//     { title: 'Palestyna' },
//     { title: 'Portugalia' },
//     { title: 'Palau' },
//     { title: 'Paragwaj' },
//     { title: 'Katar' },
//     { title: 'Reunion' },
//     { title: 'Rumunia ' },
//     { title: 'Serbia' },
//     { title: 'Rosja' },
//     { title: 'Rwanda' },
//     { title: 'Arabia Saudyjska' },
//     { title: 'Wyspy Salomona' },
//     { title: 'Seszele' },
//     { title: 'Sudan' },
//     { title: 'Szwecja' },
//     { title: 'Singapur' },
//     { title: 'Wyspa Świętej Heleny' },
//     { title: 'Słowenia' },
//     { title: 'Svalbard i Jan Mayen' },
//     { title: 'Słowacja' },
//     { title: 'Sierra Leone' },
//     { title: 'San Marino' },
//     { title: 'Senegal' },
//     { title: 'Somalia' },
//     { title: 'Surinam' },
//     { title: 'Wyspy Świętego Tomasza i Książęca' },
//     { title: 'Salwador' },
//     { title: 'Syria' },
//     { title: 'Suazi' },
//     { title: 'Turks i Caicos' },
//     { title: 'Czad' },
//     { title: 'Francuskie terytoria zależne' },
//     { title: 'Togo' },
//     { title: 'Tajlandia' },
//     { title: 'Tadżykistan' },
//     { title: 'Tokelau' },
//     { title: 'Timor Wschodni' },
//     { title: 'Turkmenistan' },
//     { title: 'Tunezja ' },
//     { title: 'Tonga' },
//     { title: 'Turcja' },
//     { title: 'Trynidad i Tobago' },
//     { title: 'Tuvalu' },
//     { title: 'Tajwan' },
//     { title: 'Tanzania' },
//     { title: 'Ukraina' },
//     { title: 'Uganda' },
//     { title: 'Dalekie Wyspy Mniejsze Stanów Zjednoczonych' },
//     { title: 'Stany Zjednoczone Ameryki' },
//     { title: 'Urugwaj' },
//     { title: 'Uzbekistan' },
//     { title: 'Watykan' },
//     { title: 'Saint Vincent i Grenadyny' },
//     { title: 'Wenezuela' },
//     { title: 'Brytyjskie Wyspy Dziewicze' },
//     { title: 'Wyspy Dziewicze Stanów Zjednoczonych' },
//     { title: 'Wietnam' },
//     { title: 'Vanuatu' },
//     { title: 'Wallis i Futuna' },
//     { title: 'Samoa' },
//     { title: 'Jemen' },
//     { title: 'Majotta' },
//     { title: 'Republika Południowej Afryki' },
//     { title: 'Zambia' },
//     { title: 'Zimbabwe' }
//   ];