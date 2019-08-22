echo Logging into Expo
$(yarn global bin)/expo login --non-interactive -u $EXPO_USERNAME -p $EXPO_PASSWORD

CHANNEL=$([ $IS_STABLE ] && echo "stable" || echo "staging")
VERSION=$(sentry-cli releases propose-version)

echo $CHANNEL $VERSION

echo Publishing to $CHANNEL
$(yarn global bin)/expo publish --non-interactive --release-channel $(echo $CHANNEL-$VERSION)

echo Creating a new sentry release
sentry-cli releases new -p whs.js $VERSION
sentry-cli releases set-commits --auto $VERSION