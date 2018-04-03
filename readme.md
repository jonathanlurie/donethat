**DoneThat** is an terminal based activity logger.  
As developers, the tool we use the most is the terminal and as developers, we sometimes have to report what we have done on the past week or month.  
**Donethat** uses a local folder to store all its data (not a database), and every new entry is a of the form of a small JSON file in a data-base folder tree. In addition, every new entry can come with tags (coma separated) so that you can annotate them for easy searching. (I personally use a Dropbox folder to store my donethat data).

Every new record with save the main message, the date, time and timezone and the geographical location (as "city, region, country")


## Install
```
npm install -g donethat
```

## Run
To add a new record, from the terminal:
```
donethat
```
Then a prompt will show-up. If it's the first time you launch *donethat*, the prompt will ask you for a place to store data.

To display the records of the the last 7 days:
```
donethat --last=7
```


# TODO
- Ensure date ascending display of the records
- Enable tags search (in addition to --last but also as *just* tags)
- Display statistics (tags, locations, frequency)
