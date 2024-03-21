const config = {
    app: {
        sid: 'bbc_afghan_tv',
        feed: 'pashto-front-page',
        schedulesKey: 'zRS5WtBPR6djXlWDOgkk4B0yHncsMeJ0',
        schedulesKey2: '2539lpzfXw9B3Vosnpcd4hI9RnFV7f0v',
        headlinesKey: 'NDmFB0HOF7oBoq6gj7KfGiaQLW7ccoYp'
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
        dari: ["SUN یکشنبه", "MON دوشنبه", "TUE سه شنبه", "WED چهارشنبه", "THU پنجشنبه", "FRI جمعه", "SAT شنبه"],
        month: ["وری", "غویي", "غبرګولی", "چنګاښ", "زمری", "وږی", "تله", "لړم", "لیندې", "مرغومی", "سلواغه", "کب"],
        numbers: ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"],
        connectors: ["ګرینویچ کې", "په"],
        heading: "د بي بي سي ورلډ سروس رادیو ویژن – افغانستان",
        published: ["XX دقیقې وړاندې خپورشوی ", "XX دقیقې وړاندې خپورشوی", "XX ساعته وړاندې خپورشوی", "XX ساعته وړاندې خپورشوی", "XX ورځې وړاندې خپورشوی", "XX ورځې وړاندې خپورشوی"]
    }
};
   
module.exports = config;