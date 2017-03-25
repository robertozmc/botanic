// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - D A T E  P I C K E R  C O N F I G U R A T I O N - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
* Date Picker Text Translation
*/
const datePickerText = {
    days: ['N', 'P', 'W', 'Ś', 'CZ', 'P', 'S'],
    months: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'],
    monthsShort: ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', "Cze", "Lip", 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'],
    today: 'Dziś',
    now: 'Teraz',
    am: 'AM',
    pm: 'PM'
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/**
* Date Picker Options
*/
export const datePickerOptions = {
    type: 'date',
    text: datePickerText,
    firstDayOfWeek: 1,
    monthFirst: false,
    today: true,
    formatter: {
        date: (date, settings) => {
            if (!date) return '';
            let day = date.getDate();
            let month = date.getMonth() + 1;
            const year = date.getFullYear();

            month = (month < 10 ? '0' : '') + month;
            day = (day < 10 ? '0' : '') + day;

            return `${day}.${month}.${year}`;
        }
    }
};