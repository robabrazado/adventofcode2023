These are my solutions for the [Advent of Code](https://adventofcode.com/) 2023. This year I'm starting out with JavaScript with the personal goal of trying to do a little more with visualizations, and I thought maybe I'd try to do something with React? I'm using VS Code for an IDE and Chrome as a browser environment for execution. This is my third year jumping into AoC and my first year trying it without Java. I'm also (apparently) working on infrastructure incrementally. I'm doing my best not to rewrite previous days after I finish them (despite my urges to do so), but also I'm trying to improve the overall "app" as I go, so once individual days are working under an overall umbrella of UI, I guess that can't help but make the older days look different then they did day-of. If I'm *really* ambitious, maybe I'll make UI versioning or something. In any case, the daily logs should hopefully indicate when those kinds of changes took place.

This README is part explanation, part apology, and sometimes blog. I make an effort to keep it spoiler-free.

I'm publishing the live site version of this repository at [aoc2023.robabrazado.com](https://aoc2023.robabrazado.com/).

Shoutout to the fun folks at the [Indie Game Reading Club](https://www.indiegamereadingclub.com/) alongside whom I'm doing the Advent of Code again this year! Thanks for the support and encouragement!

---

**Day 1 - Trebuchet?!**

I strongly considered touching this thing up before committing it, because it's a mess and because I went _way_ off the rails trying to track down and squash a bug in Part 2, but...I dunno, I'm here to learn. Took me a little bit to get my head back in a JavaScript/HTML space, but I'm starting to warm up to the environment.

**Day 2 - Cube Conundrum**

One of the rare times that I approached Part 1 in a way that ended up making Part 2 easy! Love when that happens. I also improved my development life by having the data input into the text box persist between page reloads. Hooray!

**Day 3 - Gear Ratios**

I did this one in a bit of a rush since I was heading out for the day. I was kinda pleased with the approach I took for part 1, but it turned out to be...less than ideal for part 2. If I had the usual time to plink around with it, I probably would have tried to redesign, but as it was I just kept with the technique I had started in part 1 and then probably took the long way around the barn to get to the end of part 2. Still, I feel fine about it from a "design" standpoint. Coding-wise...I really felt my unfamiliarity with JavaScript today. There was a part that seemed natural to use a Map, and in Java it's second nature to throw together a custom object that I can use for a map key that honors all the appropriate contracts and stuff, but I'd have to read the docs on how to do that in JS, and today I didn't have the time. So I did basically a kind of entries-like array that I'd use Array.find() to access, which works fine, but I recognize a bit of clunkiness in there. Also because of time, no QoL improvements this time around.

**Day 4 - Scratchcards**

This one was also a bit of a rush job; I happened to still be up when the puzzle dropped, since I was waiting for a backup to finish running. I checked out the puzzle, and part 1 seemed easy enough, so I figured I'd at least try to get one star in before closing up shop. Then part 2 felt like I could probably knock it out...though it took me a bit to actually understand the game. Once I did, though, the algorithm fell into place. I learned my lesson from last time and refactored the parsing into a separate function so I could reuse it for part 2. I think that helped, although the danger is always making some assumption in part 1 that part 2 will render obsolete. But in this case, things seemed to work out!

**Day 5 - If You Give A Seed A Fertilizer**

Womp-womp. When I started this one, I went back to my old OOP habits, since that's the way the problem made sense to me, and that worked fine for part 1 and for the *sample* data for part 2, but for the *actual* run of part 2, it was clear I was basically brute-force searching a very large search space. My gut tells me there's some clever mathematical solution for this (as opposed to this being a code architecture issue), but I just didn't have the time to work at it. I just let the giant search run its course while I was doing other things. Definitely not proud of part 2, but it got there in the end, so...onward, I guess. Too bad, too. I liked my neat little chain-of-searches implementation for part 1, but it turned out that was not the functionality I should have been paying attention to.

**Day 6 - Wait For It**

Trying to learn my lesson from yesterday, I tried to approach this less like trying to write a general purpose tool given the problem description and more like solving this like a math puzzle. Execution time was lickety-split, and I was even able to leverage almost all my part 1 work for part 2! I feel good about how this one went. Even though I was surprised to find myself at this ripe old age finally making use of remembering the quadratic formula. I don't think that's too spoilery, particularly because it was probably the hard way to do it. I feel like most of the work on this one was working out the math, so I put a lot of that thought process in the comments of the source.

**Day 7 - Camel Cards**

Yeah...I think this is going better for me now that I'm actually paying attention to the puzzle question rather than trying to implement a general tool. I think today's the first day I actually felt clever about the solution. By which I mean I didn't go straight to the brute force search approach.

Addendum: it dawned on me looking at my Day 7 code, since I'm tending to stuff both solutions into one file, maybe I'll start doing commits between parts. That way it will be clearer what I had to modify for part 2 when I lean heavily on the part 1 stuff. Like...I was looking at my Day 7 code and without a record of what I changed between parts 1 and 2, it looks by my method signatures that I dislpayed remarkable foresight. XD

**Day 8 - Haunted Wasteland**

I was 100% lulled into a false sense of security by the ease of part 1. I went through two or three revisions on part 2 before getting to the answer. I'm keeping spoilers out of the README, so for a record of my failures and thought processes, check the comments in the source. Suffice it to say, my first attempt was the brute force suggested by the problem description and was taking long enough that I didn't think I could just let it run. Actually I probably could have, technically, but it was enough to give me a hint that it probably wasn't the way to go. My second try failed, but not for the reasons I thought. So my third try actually does a little more than it had to, but I learned from the extra stuff that the second try was probably fine and I was just doing it wrong. So I course-corrected the second try, and here we are. It still takes a while, but definitely not as much as the first try, so overall it's a win. I'm pretty sure the algorithm could be improved with better math, but I'm letting this one sit.

**Day 9 - Mirage Maintenance**

Given all the shenanigans of day 8, I have to admit I expected much worse from day 9, but it went pretty fast! I feel like this is one of those rare ones that made me happy to be using JavaScript, because arrays are natively also deques.

**Day 10 - Pipe Maze**

I finished part 1, and at the moment I have no idea how to proceed with part 2, but also I have to abandon the project for a while, so I'll try and think about part 2 and hopefully pick it up again later!

\[sometime the next day...\]

Yikes. Okay, so...I spent *hours* trying to figure out how to work part 2. (Without getting too spoilery, let me say the "squeezing" part really screwed me up.) I went through a couple different designs (this is a time when I kinda regret not committing code that doesn't work, but eh). The design I eventually committed was...I dunno, maybe my second or third stab at an architecture, but it was *definitely* my second try at an implementation; my first one just was not working out at all, and I could NOT figure out why. Based on log output, I was running WAY more loops that I should have been, so the fear started to grow that the problem was some kind of buried JavaScript typo like a misplaced brace or missing semicolon or something that I'd never be able to track down...something that passed parsing but that totally changed the structure of things. In any case, I wiped it out and started the implementation over of that same design. Kept some better notes (left in the source comments), and eventually got where I needed to go. I also decided to leave in some of my extra output that I kinda used for testing, just cuz I thought it looked neat. But anyway. A day late, I'm glad to have that one behind me now.

**Day 11 - Cosmic Expansion**

I started (and finished, as it turned out) this day before finishing up day 10, so I tried to branch the repository so I could check in my changes without exposing my broken day 10 part 2 situation. I guess I won't know if that's gonna work out for me until I finish writing this. (I am in no way a git expert.) In any case, this one was a mixed bag. I got through part 1 easily enough, though it turned out that what I did for part 1 was basically useless for part 2, so for part 2 I rewrote the whole thing. The rewritten version still works fine for part 1, so I refactored part 1 rather than leave the old supporting code in. This is exactly the situation I envisioned when deciding to commit changes between parts, so I hope I can get the repository branches sorted out correctly. In *theory* I should be somewhat(?) close to finishing day 10 part 2? But we know how that goes. Fingers crossed for finishing that up soon, too!

**Day 12 - Hot Springs**

Part 1 - I know going into this that I'm going to regret doing a brute force, if not for part 1, then almost certainly for part 2. Let's find out...

\[later...\]

Yeah, I halfway regretted it for part 1. It's a little long-running, but it got there. I fully regret it for part 2 by just looking at the problem. I know that it's not going to work. Well...it *might* work with some modification, but it would take a really long time. Trying to figure out a better approach for part 2.

**Day 13 - Point of Incidence**

Part 1 - I haven't finished part 2 from yesterday yet, but I think I can knock this part 1 out quick, and I'm going to try out an idea inspired by one line of thinking from yesterday's puzzle.

\[later...\]

The concept worked fine, but an (unrelated) bug took me a while to hunt down, so I've just left in a lot of extra checking and junk that I didn't need but added during debugging.

**Day 14 - Reflector Dish**

Part 1 - No fancy strategy, not trying to predict part 2, just straight up implementing the problem as stated. I might be happier treating part 2 as just a whole separate puzzle. :) This is, what, now three part 2s I've left undone? This will probably be the fourth. At the time I'm logging this, it's...less than four hours until the next puzzle drops, so I'm pretty significantly behind "schedule" at this point. Hoping for a catchup day soon!

Part 2 - I attempted a quick implementation for part 2 based on the work I did for part 1. I knew it was going to be slow to execute, but it was (relatively) quick to code, and on the off chance it wasn't *that* slow, I took a shot. Testing the sample data took something like 3 or 4 hours. Projected time to run on the puzzle input: 25 days. Yeah...time for a redesign.

\[some other day...\]

**Day 15 - Lens Library**

This one flew by! I happened to be around when today's puzzle dropped, and part 1 looked easy enough, so I thought I'd try and knock that out before I turned in for the night. Then, part 2 looked pretty straightforward, too, so I figured I'd give that a shot, and here we are! So that's encouraging; maybe after I sleep I can use the extra time to try and catch up on all the part 2s I've been leaving behind. Heh, it just occurred to me that this one went so fast that I didn't even commit after part 1. In this case, though, it didn't even matter, because I didn't even alter any part 1 code for part 2! Today was a good day!

**Day 16 - The Floor Will Be Lava**

So...I was up again when the puzzle dropped today, and the original plan was to see if I could do a quick part 1 before bed and then hit part 2 after a night's sleep. Part 1 went pretty well; the plan was like day 14: no real future-proofing, just a straightforward implementation with the intent of redesigning for part 2 later on. But it turned out part 2 was a quick adaptation of my part 1 implementation, and part 1 ran fast enough and the part 2 search space seemed reasonable enough that I thought I could get away with a part 1 brute force, and it turned out I could! So I wound up with another quick day. Not as quick as day 15, but I'll take it! Really hoping to bank some time getting back to earlier stuff.

**Day 17 - Clumsy Crucible**



**Day 18 - Lavaduct Lagoon**



**Day 19 - Aplenty**

At this point I've missed a couple days, and that's in addition to the part 2s from earlier that I still haven't gotten back to. But it feels nice to start anew each day, so I'm taking on today before going back to work on missed stuff.

Part 1 - I have to admit, I love building these little engines. I think the way I did this one involved some poor object design in the general case, but I'm still kinda trying to ignroe the general case for these puzzles. Also the code for this is pretty gnarly-looking; I did a lot of compact JavaScript and not a lot of commenting, so...you get what you get. In any case, it turns out what I did for part 1 is largely useless for part 2. Amazingly, I don't think this was the fault of the poor object design mentioned earlier. :) But it does mean for part 2 I'll basically be starting from scratch. Which honestly doesn't bother me so much anymore.

Part 2 - Okay, I can admit it. Just to see, I tried to make use of all the part 1 code and brute force my way through part 2. This proved...impractical. (Because of this, there's a weird change to the part 1 code committed between parts 1 and 2. That's an artifact of my brute force trial run; it doesn't change the functionality of part 1). So it was back to the drawing board for sure. My part 2 basically uses none of the code from my part 1. I do basically the same parsing operations for the puzzle data, but that's about it.

I know overall I'm going to regret my lack of comments on this one if I ever go back and look at it again. This is not going to be good reference code. :) Also I let my Java habits really take over for this puzzle. Specifically, there were parts for which in Java I would want to use subclasses or interfaces or something, but I don't know the appropriate JavaScript idioms for that stuff, so really there's just a bunch of weird little classes in there that do almost the same thing and "interface" is more like a "social contract" in there. I'd probably find this easier to work out in a clearner way if I were more of a functional programmer, but...well, I'm not. OOP forever. ;)
