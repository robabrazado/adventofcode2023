These are my solutions for the [Advent of Code](https://adventofcode.com/) 2023. This year I'm starting out with JavaScript with the personal goal of trying to do a little more with visualizations, and I thought maybe I'd try to do something with React? I'm using VS Code for an IDE and Chrome as a browser environment for execution. This is my third year jumping into AoC and my first year trying it without Java. I'm also (apparently) working on infrastructure incrementally. I'm doing my best not to rewrite previous days after I finish them (despite my urges to do so), but also I'm trying to improve the overall "app" as I go, so once individual days are working under an overall umbrella of UI, I guess that can't help but make the older days look different then they did day-of. If I'm *really* ambitious, maybe I'll make UI versioning or something. In any case, the daily logs should hopefully indicate when those kinds of changes took place.

This README is part explanation, part apology, and sometimes blog. I make an effort to keep it spoiler-free.

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
Yeah...I think this is going better for me now that I'm actually paying attention to the puzzle question rather than trying to implement a general tool. I think today's the first day I actually felt clever about the solution. By which I mean I didn't go straight to the brute force search approach. Addendum: it dawned on my looking at my Day 7 code, since I'm tending to stuff both solutions into one file, maybe I'll start doing commits between parts. That way it will be clearer what I had to modify for part 2 when I lean heavily on the part 1 stuff. Like...I was looking at my Day 7 code and without a record of what I changed between parts 1 and 2, it looks by my method signatures that I dislpayed remarkable foresight. XD
