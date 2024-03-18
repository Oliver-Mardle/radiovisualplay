# react-now-next-iplayer
React Now/Next
This is a demo website of a simple React based 16:9 TV overlay using HTML5 graphics.
text 6

Customisation using url parameters

It can be configured with the following url parameters:

sid specifies the channel to retrieve data from. if not present, 'bbc_afghan_tv' is used, 'bbc_world_service' available
region the region the channel is running in, selects the BBC News logo, defaults to 'pashto', 'en' available
language sets the language of the times and headings. Defaults to 'pashto', 'english' is available. More can be added in the config file
feed specifies the news feed to pick up. The default is 'pashto_front_page', 'news_england' is available.
fullTime specifies the format of the date/time. "Day" - "HH:MM" or "Day" "Date" "Month" "Year" - "HH:MM". 'true' or 'false'.

Further customisation
The file App.js contains all the logic for the programme. It can be modified to change the styling of the graphics information or the DoG urls or any element of the page.

These defaults are hard coded:

Interval between polling for now/next/later information: 10 seconds.
Interval between polling for headlines: 10 seconds.