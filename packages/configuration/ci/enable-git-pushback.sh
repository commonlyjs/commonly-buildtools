git remote rm origin
git remote add origin https://commonlyjs:${GH_TOKEN}@github.com/commonlyjs/commonly-buildtools.git
git config --global user.name "commonly buildbot"
git config --global user.email "build@commonlyjs.com"
git fetch
git checkout master
