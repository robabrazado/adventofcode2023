These are my solutions for the [Advent of Code](https://adventofcode.com/) 2023. This year I'm starting out with JavaScript with the personal goal of trying to do a little more with visualizations, and I thought maybe I'd try to do something with React? I'm using VS Code for an IDE and Chrome as a browser environment for execution. This is my third year jumping into AoC and my first year trying it without Java. I'm also (apparently) working on infrastructure incrementally. I'm doing my best not to rewrite previous days after I finish them (despite my urges to do so), but also I'm trying to improve the overall "app" as I go, so once individual days are working under an overall umbrella of UI, I guess that can't help but make the older days look different then they did day-of. If I'm *really* ambitious, maybe I'll make UI versioning or something. In any case, the daily logs should hopefully indicate when those kinds of changes took place.

This README is part explanation, part apology, and sometimes blog. I make an effort to keep it spoiler-free.

Shoutout to the fun folks at the [Indie Game Reading Club](https://www.indiegamereadingclub.com/) alongside whom I'm doing the Advent of Code again this year! Thanks for the support and encouragement!

---

**Day 1 - Trebuchet?!**

I strongly considered touching this thing up before committing it, because it's a mess and because I went _way_ off the rails trying to track down and squash a bug in Part 2, but...I dunno, I'm here to learn. Took me a little bit to get my head back in a JavaScript/HTML space, but I'm starting to warm up to the environment.

**Day 2 - Cube Conundrum**

One of the rare times that I approached Part 1 in a way that ended up making Part 2 easy! Love when that happens. I also improved my development life by having the data input into the text box persist between page reloads. Hooray!

**Day 3 - Gear Ratios**

I did this one in a bit of a rush since I was heading out for the day. I was kinda pleased with the approach I took for part 1, but it turned out to be...less than ideal for part 2. If I had the usual time to plink around with it, I probably would have tried to redesign, but as it was I just kept with the technique I had started in part 1 and then probably took the long way around the barn to get to the end of part 2. Still, I feel fine about it from a "design" standpoint. Coding-wise...I really felt my unfamiliarity with JavaScript today. There was a part that seemed natural to use a Map, and in Java it's second nature to throw together a custom object that I can use for a map key that honors all the appropriate contracts and stuff, but I'd have to read the docs on how to do that in JS, and today I didn't have the time. So I did basically a kind of entries-like array that I'd use Array.find to access, which works fine, but I recognize a bit of clunkiness in there. Also because of time, no QoL improvements this time around.
