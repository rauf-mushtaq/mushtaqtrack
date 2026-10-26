# MushtaqTrack

A low-poly time-trial racer in the style of PolyTrack, in a single HTML file (`index.html`, with Three.js and Ammo.js loaded from CDNs).

## Play

Open `index.html` in a browser. There's nothing to build or install.

To play it from a link, turn on GitHub Pages for this repository (Settings → Pages → Deploy from a branch → `main`, folder `/`). The game is then at `https://<your user name>.github.io/mushtaqtrack/`.

The first time you open the game it asks for your name or nickname. Your times, ghosts, custom tracks and settings are saved in the browser's local storage.

## Features

- **Car physics**: runs on [Ammo.js](https://github.com/kripken/ammo.js), the JavaScript port of the Bullet physics engine. Each car is a Bullet raycast vehicle: a rigid chassis on four raycast wheels with sprung suspension. Grip comes from a friction-circle tyre model that uses each wheel's load from Bullet. The road is Bullet collision geometry built from the track; barriers, pillars and blocks are handled by the car itself, so brushing one slides you along it instead of spinning you round. It's very grippy, with top speeds kept moderate so you stay in control through the turns (the speedometer reads 70% of the true speed, about 115–140 km/h flat out), and you get weight transfer, wheelspin and real slides. The road is a true 3D surface, so cars can drive banked turns, ride walls and go upside down through loops. A small handling layer on top adds the drift, boosts and air control, and keeps the car on banked turns, wall rides and loops. As in PolyTrack, a car going fast enough flies off the top of a ramp or a crest. After a landing the throttle cuts briefly so the back wheels can settle.
- **Air control**: in the air, steering turns the car and Space works as an air brake that stops it spinning. The car lines itself up with the road it's coming down on, so it lands flat on its wheels, and a very big drop is cushioned.
- **Drift**: the cars grip and stay straight through corners. To drift, hold Space (the handbrake) as you turn in to slide the tail out, keep steering into the slide to hold it, then straighten up for a small drift boost; longer drifts give bigger boosts.
- **Track pieces**: road, tight, wide and **banked** turns, **wall rides**, **loops** and **massive loops** (35 m tall; both exit a lane left or right, and the car turns with the road through them unless you steer), **plazas** (open squares with no barriers; raised up, a plaza is the roof of a building with solid walls), ramps, **long slopes** and **steep ramps**, kickers, boost pads, **pillars** and **chicane blocks**, **tunnels**, checkpoints, and arrow signs on tight turns. Obstacles: **spinners** (a bar that sweeps the whole road; pass on the side it's turning away from), **presses** (a beam across the road that lifts and slams down; drive under it while it's up), **walls**, and rows of **bollards**. Pads: a **jump pad** throws you high and forward, enough to clear a wall just past it, and a **super boost** fires you off at 8000 km/h for a flight of about 2.4 km.
- **Environments**: Summer, Winter (snowy pines) and Desert (cacti and mesas), combined with time of day.
- **14 cars** in the garage, each with its own model and handling: an open-wheel formula car, an Italian-style supercar, a rear-engine German-style GT, a Le Mans-style prototype, a hypercar, an electric hypercar, a stock car, a muscle car, a drift coupé, a rally hatch, an off-road pickup, a classic roadster and a go-kart. You can repaint any of them. The names are made up and there are no real brand logos.
- **83 official tracks** across Easy, Medium, Hard, Expert, **Sky**, **Stunt** and **Circuit**, plus a **daily track** and **endless random tracks** from a seed you can share. The generator uses every kind of road piece (the obstacles, pads and plazas are for the editor and the City).
- **Medals** (Bronze, Silver, Gold, Author), and a **ghost of your best run** with live split deltas.
- **Sky tracks**: rows of boost pads, a climb up steep ramps, and a big jump onto a platform in the air with the finish on it.
- **Stunt tracks**: 25 tracks packed with loops, massive loops, kicker jumps, steep-ramp launches, wall rides, banked turns, tunnels and chicanes, from Loop Street up to Grand Finale.
- **Circuit tracks**: 20 closed laps in the style of Grand Prix circuits, with the finish line just behind the start: long straights with boost pads, heavy-braking hairpins, chicanes, esses, fast sweepers, banked corners, hills, a figure-eight with a bridge and a banked oval. The names are made up.
- **Steep ramps** climb two levels in one piece and shape themselves to what joins them: from flat road one curves up smoothly, steep ramps in a row make one long climb, and a steep ramp with nothing after it launches you into the air.
- **Track editor** with 27 piece types, height levels, an environment picker, undo, a route check, and `MT1.` share codes. On a tablet or phone, tap to place a piece, drag with one finger to move around, and pinch with two fingers to zoom.
- Red/white barriers on every edge (you can clear them when airborne), skid marks, tyre smoke, engine sound, three cameras (the chase camera rolls with the car through loops), a minimap, and keyboard, gamepad and large touch controls. On tablets and phones the 3D view is drawn at a lower resolution (with smaller shadows) so it runs smoothly; the menus and text stay sharp.
- An autopilot drives the menu background. It was used to test all 14 cars on all 83 official tracks, and to set the medal times.

## Online features

The online parts need somewhere to keep shared data and to connect players. This version uses [Firebase](https://firebase.google.com) (free plan): Cloud Firestore keeps the shared tracks, times, ghosts and names, the Realtime Database runs the live race rooms, and anonymous sign-in gives each browser its own player id. Until you add your Firebase settings to `online-config.js` (see [Turning on the online features](#turning-on-the-online-features)), the game is single-player: these parts stay hidden and everything else works.

The game was written to run as a Claude artifact too, where the artifact runtime provides the same things; `online.js` provides them from Firebase instead, so `index.html` is the same game either way.

- **Your name** is what other players see on leaderboards, community tracks, ghosts, live races and chat. Change it any time with Change on the menu or in Settings.
- **Community tracks**: press Publish on a track under Yours and everyone who plays the game sees it in the Community tab, with its maker's name. They can race it or copy it into their own editor. You can update or unpublish your own tracks, and the game's owner can remove any track.
- **Leaderboards**: every player's best time on each track goes on a shared board, showing their name and car. Each track card shows the record and your place, and you can click it to see the full board. A board belongs to the track's layout, so the daily, a random seed, a community track or an imported code all have boards too. The game's owner can remove a time.
- **Ghosts of the top times**: a time that makes a track's top ten is posted with its ghost. On a leaderboard (or the finish screen), switch on Ghost next to other players' times to race against them, up to five at once.
- **Live races**: press Race online to host a race or join one from the list of open races; while someone is hosting, everyone else on the menu gets an invitation with a Join button. The host picks the track and presses Start, everyone gets the same 3-2-1 countdown, and other racers show as see-through cars with their names. The HUD shows live positions and the finish screen the results; places go by time, and each player's clock runs from their own "Go". The race room has a chat.
- **The City**: under Race online, a free-roam practice map that anyone can drive into at any time and drive around with everyone else who's there. The whole floor is open, with a Rooftop Run (jump from roof to roof across the alleys), a skate park with funboxes, kickers, a loop and a steep launch, a stunt yard with a massive loop and a ramp pyramid, Big Air, which launches you onto a roof 20 m up, and two super boost runways that fire you out of town. Free roam has no clock: R takes you back to the start and Enter puts your car back on its wheels. There are **18 timed obstacle courses**. Six are in the **Obstacle District** at the west end: Slalom, Spinner Alley, Piston Press, Wall Hop, Twister and Madness. Twelve more are in the **Course Park** north of town: The Gauntlet, Bounce House (jump pad after jump pad), Sweepers, Tunnel Vision, Loop Lane, Pinball, Zigzag, Sky Gauntlet (obstacles on a road 20 m up), Hill Hopper, Big Wheel (massive loops), Gap Jumper and Switchback. Drive through a course's start gate and the clock runs until its finish gate. Press Esc (or Pause) and pick Courses to see your best times and go straight to any course's start. Your best time on each course is kept on your device, and each finish is posted to the City chat. The City has a **chat**: press T (or tap Chat) to type, and Enter sends. Messages show over the road and fade after 20 seconds; anyone who drives in sees the last couple of minutes.

Anyone who opens the page can publish tracks, post times and race. Each player can only change their own data; the game's owner (you, once your player id is in the settings) can remove anyone's tracks and times.

## Turning on the online features

You need a Google account. It takes about ten minutes and the free plan is enough.

1. **Create a project.** Go to the [Firebase console](https://console.firebase.google.com), choose **Create a project**, and give it a name such as `mushtaqtrack`. Google Analytics isn't needed.
2. **Add a web app.** On the project's overview page, click the web icon (`</>`), give the app a nickname, and click **Register app**. Keep the `firebaseConfig` settings it shows; you'll paste them in step 6.
3. **Turn on anonymous sign-in.** Open **Build → Authentication**, click **Get started**, then under **Sign-in method** choose **Anonymous**, switch it on and save.
4. **Create the Firestore database.** Open **Build → Firestore Database → Create database**, pick a location near your players, and start in **production mode**. On its **Rules** tab, replace everything with the contents of [`firestore.rules`](firestore.rules) and click **Publish**.
5. **Create the Realtime Database.** Open **Build → Realtime Database → Create database**, pick a location, and start in **locked mode**. On its **Rules** tab, replace everything with the contents of [`database.rules.json`](database.rules.json) and click **Publish**. Copy the database's address from the top of its **Data** tab (it looks like `https://your-project-default-rtdb.firebaseio.com`, or ends in `firebasedatabase.app` outside the US).
6. **Add the settings to the game.** Edit [`online-config.js`](online-config.js) on GitHub (the pencil icon), replace `window.MUSHTAQ_ONLINE = null;` with the filled-in version shown in that file, paste in your `firebaseConfig` values, and make sure `databaseURL` is the address from step 5. Commit the change.
7. **Make yourself the owner.** Open the game (from GitHub Pages), pick your name, then in the Firebase console go to **Authentication → Users** and copy the **User UID** of the player that was just created. Put it in `online-config.js` as `ownerUid`, and in the Firestore rules (step 4) in place of `PASTE_YOUR_PLAYER_ID_HERE`, then publish the rules again. Your player id belongs to that browser, so do this in the browser you'll use to look after the game.

Each browser gets its own player id the first time it opens the game, and keeps it. Clearing the browser's site data starts a new player.

The free plan comfortably covers a group of friends. Shared lists are read in full when the game opens, so a very busy game (thousands of visits a day) could reach the free plan's daily read limit, and then the shared lists stop loading until the next day.

To try the online features on your own computer without a Firebase project, run `firebase emulators:start --project demo-mushtaqtrack` here (with the [Firebase CLI](https://firebase.google.com/docs/cli)), serve this folder with any local web server, and add `emulators: true` to the settings in `online-config.js`.

## Controls

| Key | Action |
| --- | --- |
| W / ↑ | Accelerate (the clock starts on your first input) |
| S / ↓ | Brake, then reverse |
| A D / ← → | Steer (also in the air) |
| Space / Shift | Handbrake; air brake in the air |
| R | Instant restart (in a live race: back to your last checkpoint) |
| Enter | Back to last checkpoint |
| C | Switch camera |
| T | Chat (in the City) |
| Esc / P | Pause |
| M | Mute |
| G | Garage (from the menu) |

Gamepads work too: RT gas, LT brake, X handbrake, Y restart, B checkpoint.
