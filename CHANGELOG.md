# Changelog
## 2.6.0
- Dragons with a TOD specified will sort first. Multiple TODs will sort by the dragon dying soonest.
## 2.5.3
- Got rid of the undesirable ?tod=null from query string when not used.
## 2.5.2
- Bug fix: exclude dragons with 0 instances from icon cycler and stop AR when no refreshable dragons are available.
- Bug fix: 'falsey' session values would use the default values. In other worse things like smart removal wouldn't persist across refreshes.
- Some code refactorings.
- Cleaner handling of TOD calculations.
- Make icon cycler more seamless by removing one second lag at the beginning.
## 2.5.1
- Bug fix: page stretching due to timepicker
- Some presentation changes.
- Some code cleanup.
## 2.5.0
- Added a TOD clock.
- "Instances" now accepts 0 to add the dragon but not auto-refresh it.
## 2.4.1
- Tidied up some code.
- Added a local clock.
## 2.4.0
- The app now reports errors.
- Improved header (now footer).
## 2.3.0
- Fix bug with icon cycler not acknowledging removed dragons.
- Persist state across refreshes.
- Docker changes.
- Standardizing stuff across my apps.

## 2.2.0
- Added port redirect and gzip to nginx config. zoom zoom
- When auto-refreshing, page title now changes to code.
## 2.1.1
- Bugfix: Stopped additional views from the favicon and control panel.
- Favicon now cycles every second, previously it would set to the selected refresh rate.
- Added a changelog.

## 2.1.0
- Now fogged items can be added. The tool will disallow dead, adults and frozen hatchlings.

## 2.0.0
- Smart removal: Smart removal will try to detect changes for each dragon and remove freshly hatched eggs or newly grown adults. However with some breeds this may not be accurate and still require manual removal. 
- Interface looks a bit more polished.

## 1.0.0
Initial release.