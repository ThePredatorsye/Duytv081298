
const INTERSTITIAL_PLACEMENT_ID = '1304584393307296_1331550857277316';
const REWARDED_PLACEMENT_ID = '1304584393307296_1331541930611542';
const REWARDED_BANNER_ID = '1304584393307296_1331571300608605';

var watchedInterstitials = 0;
var watchedRewardedVideos = 0;
var preloadedRewardedVideo = null;
var videoAddbottle = null;
var videoHack = null;
var preloadeddBanner = null;
export default class Ads {
    constructor(main) {
        this.main = main
        this.addBottle = false;
        this.addHack = false;
        this.loadRewardedVideoAsync();
        this.loadAdAddBottle();
        this.loadAdHack();
        this.loadBannerAdAsync()
    }
    loadInterstitialAdAsync() {
        FBInstant.getInterstitialAdAsync(
            INTERSTITIAL_PLACEMENT_ID, // Your Ad Placement Id
        ).then((interstitial) => {
            // Load the Ad asynchronously
            videoAddbottle = interstitial;
            return videoAddbottle.loadAsync();
        }).then(() => {
            console.log('Interstitial preloaded');
        }).catch((err) => {
            console.log('Interstitial failed to preload: ' + err.message);
        });
    }
    loadRewardedVideoAsync() {
        FBInstant.getRewardedVideoAsync(
            REWARDED_PLACEMENT_ID, // Your Ad Placement Id
        ).then((rewarded) => {
            // Load the Ad asynchronously
            preloadedRewardedVideo = rewarded;
            return preloadedRewardedVideo.loadAsync();
        }).then(() => {
            console.log('Rewarded video preloaded');
        }).catch((err) => {
            console.log('Rewarded video failed to preload:' + err.message);
        });
    }

    loadBannerAdAsync() {
        FBInstant.loadBannerAdAsync(
            REWARDED_BANNER_ID, 
        ).then(function () {
            console.log('loadBannerAdAsync resolved.');
        }).catch(function (err) {
            console.error('Banner failed to load: ' + err.message);
        }
        );
    }

    showInterstitial(type) {
        if (type == 'addBottle') {
            if (this.addBottle) {
                videoAddbottle.showAsync()
                    .then(() => {
                        console.log('Interstitial ad finished successfully');
                        this.addBottle = false
                        this.main.addBottle();

                    })
                    .catch((e) => {
                        console.log(e.message);
                    });
            }
        } else if ("hack") {
            if (this.addHack) {
                videoHack.showAsync()
                    .then(() => {
                        console.log('Interstitial ad finished successfully');
                    })
                    .catch((e) => {
                        console.log(e.message);
                    });
            }
        }


    }

    showRewardedVideo() {
        preloadedRewardedVideo.showAsync()
            .then(() => {
                console.log('Rewarded video watched successfully');
            }).catch(function (e) {
                console.log(e.message);
            });
    }
    loadAdAddBottle() {
        var type = 'addBottle'
        FBInstant.getInterstitialAdAsync(INTERSTITIAL_PLACEMENT_ID)
            .then((interstitial) => {
                videoAddbottle = interstitial;
                return videoAddbottle.loadAsync();
            }).then(() => {
                this.filterType(type, true)
                console.log('Interstitial 1 preloaded')
            }).catch((err) => {
                this.filterType(type, false)
                console.error('Interstitial 1 failed to preload: ' + err.message);
                setTimeout(() => { this.handleAdsNoFill(videoAddbottle, 2, type); }, 30 * 1000);
            });


    }

    loadAdHack() {
        var type = 'hack'
        FBInstant.getInterstitialAdAsync(INTERSTITIAL_PLACEMENT_ID)
            .then((interstitial) => {
                videoHack = interstitial;
                return videoHack.loadAsync();
            }).then(() => {
                this.filterType(type, true)
                console.log('Interstitial 1 preloaded')
            }).catch((err) => {
                this.filterType(type, false)
                console.error('Interstitial 1 failed to preload: ' + err.message);
                setTimeout(() => { this.handleAdsNoFill(videoHack, 2, type); }, 30 * 1000);
            });
    }


    handleAdsNoFill(adInstance, attemptNumber, type) {
        if (attemptNumber > 3) { return; }
        else {
            adInstance.loadAsync().then(() => {
                this.filterType(type, true)
                console.log('Interstitial preloaded')
            }).catch((err) => {
                this.filterType(type, false)
                console.error('Interstitial failed to preload: ' + err.message);
                setTimeout(() => { handleAdsNoFill(adInstance, attemptNumber + 1); }, 30 * 1000);
            });
        }
    }
    filterType(type, status) {
        switch (type) {
            case 'hack':
                this.addHack = status;
                break;
            case 'addBottle':
                this.addBottle = status;
                break;
        }
    }
}