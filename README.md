# canna-recommend
Recommend cannabis strains and products to users, because there are thousands of strains and not enough time to learn about them all.

# Directions for running
Install nltk packages:
```python
import nltk
for i in ['stopwords', 'wordnet']:
  nltk.download(i)
```
Install mongodb.
First, import the database:

```bash
cd leafly/leafly_mongodb.db
ulimit -n 64000
mongorestore -d leafly_backup_2016-11-01 leafly_backup_2016-11-01
```

Annoyingly, I had to change my `/etc/mongod.conf` file to have `bind_ip = 0.0.0.0` (http://stackoverflow.com/questions/24899849/connection-refused-to-mongodb-errno-111).

If you get an error, you may need to up the ulimit: http://stackoverflow.com/questions/34666769/mongodb-error-failed-24-too-many-open-files-using-pymongo


(The db was exported with `mongodump -d leafly_backup_2016-11-01 leafly_backup_2016-11-01`)
Make sure to run all scripts from the main directory of the project (canna-recommend).  E.g. python2 apps/web_app/app.py
This is due to relative imports in the script, which I standardized by expecting the script to be run from the home dir.

#
