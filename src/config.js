const config = {
    app: {
        sid: 'bbc_afghan_tv',
        feed: 'pashto-front-page',
        schedulesKey: '',
        schedulesKey2: '',
        headlinesKey: ''
    },
    languageCodes: {
        en: "english",
        ps: "pashto",
        uz: "uzbek",
        dr: "dari",
        fa: "farsi"
    },
    english: {
        day: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        month: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        numbers: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        connectors: ["GMT", "at"],
        heading: "BBC World Service Radio Vision - England",
        published: ["Published XX minute ago", "Published XX minutes ago", "Published XX hour ago", "Published XX hours ago", "Published XX day ago", "Published XX days ago"]
    },
    pashto: {
        day: ["یکشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"],
        dari: ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"],
        uzbek: ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"],
        month: ["وری", "غویي", "غبرګولی", "چنګاښ", "زمری", "وږی", "تله", "لړم", "لیندې", "مرغومی", "سلواغه", "کب"],
        numbers: ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"],
        connectors: ["د ګرېنویچ وخت", "په"],
        dariconnectors: ["ګرینویچ", ""],
        uzbekconnectors: ["گرینویچ وقتی", "ده"],
        heading: "د بي بي سي ورلډ سروس رادیو ویژن – افغانستان",
        published: ["XX دقیقې وړاندې خپورشوی ", "XX دقیقې وړاندې خپورشوی", "XX ساعته وړاندې خپورشوی", "XX ساعته وړاندې خپورشوی", "XX ورځې وړاندې خپورشوی", "XX ورځې وړاندې خپورشوی"],
        farsipublished: ["XX دقیقه پیش", "XX دقیقه پیش", "XX ساعت پیش", "XX ساعت پیش", "XX  روز پیش", "XX  روز پیش"]
    }
};
   
module.exports = config;