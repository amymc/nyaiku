import Head from "next/head";
import Image from "next/image";
// import { CMUDict } from "cmudict";
import axios from "axios";
import cmudict from "@stdlib/datasets-cmudict";

import styles from "../styles/Home.module.css";

const Home = ({ suffixMap1, suffixMap2, corpus }) => {
  const { dict } = cmudict();
  debugger;
  const generate = () => {
    console.log({ suffixMap1, suffixMap2, corpus });
    const countSyllables = (word, corpus) => {
      let numSyls = 0;

      let phonemeStr = dict[word.toUpperCase()];
      console.log({ phonemeStr });
      console.log(word.toUpperCase());
      // console.log({ dict });
      // debugger;

      if (word.endsWith("'s") || word.endsWith("’s")) {
        word = word.slice(0, word.length - 2);
        phonemeStr = dict[word];
        // console.log({ phonemeStr });

        if (!phonemeStr) {
          return countSyllables(
            corpus[Math.floor(Math.random() * corpus.length)],
            corpus
          );
        }

        const phonemes = phonemeStr.split(" ");
        for (const phoneme of phonemes) {
          const lastChar = phoneme.slice(phoneme.length - 1);
          if (Number.isInteger(parseInt(lastChar, 10))) {
            numSyls += 1;
          }
        }
      } else if (phonemeStr) {
        // # hasattr(cmudict, word):
        // # else:
        // # print(cmudict[word])
        const phonemes = phonemeStr.split(" ");

        for (const phoneme of phonemes) {
          const lastChar = phoneme.slice(phoneme.length - 1);
          console.log({ lastChar });
          if (Number.isInteger(parseInt(lastChar, 10))) {
            numSyls += 1;
          }
        }
      }

      if (numSyls === 0) {
        return countSyllables(
          corpus[Math.floor(Math.random() * corpus.length)],
          corpus
        );
      }

      // # else:
      // #     return None
      // #     num_sylls += 1
      return numSyls;
    };

    const constructHaikuLine = (
      suffixMap1,
      suffixMap2,
      corpus,
      endPrevLine,
      targetSyls
    ) => {
      let line = "2/3";
      let lineSyls = 0;
      let currentLine = [];

      //build first line
      if (endPrevLine.length == 0) {
        line = "1";
        console.log({ corpus });
        let stuff = randomWord(corpus);
        console.log("stuff", stuff);
        let { word, numSyls } = stuff;

        if (numSyls == 0) {
          return constructHaikuLine(
            suffixMap1,
            suffixMap2,
            corpus,
            endPrevLine,
            targetSyls
          );
        }

        currentLine.concat(word);
        lineSyls += numSyls;
        let wordChoices = wordAfterSingle(
          word,
          suffixMap1,
          lineSyls,
          targetSyls,
          corpus
        );
        console.log({ word, wordChoices });

        while (wordChoices.length == 0) {
          // const prefix = random.choice(corpus)
          console.log("here", { wordChoices });

          const prefix = corpus[Math.floor(Math.random() * corpus.length)];
          wordChoices = wordAfterSingle(
            prefix,
            suffixMap1,
            lineSyls,
            targetSyls,
            corpus
          );
        }
        // # word = random.choice(word_choices)
        // # numSyls = count_syllables(word)

        const result = getNumSyls(wordChoices);
        word = result.word;
        numSyls = result.numSyls;
        lineSyls += numSyls;
        currentLine.concat(word);
        if (lineSyls == target_syls) {
          endPrevLine.concat(currentLine.slice(currentLine.length - 2));
          return currentLine, endPrevLine;
        }
      }

      //build lines 2 & 3
      else {
        currentLine.concat(endPrevLine);
      }

      while (true) {
        prefix =
          currentLine[currentLine.length - 2] +
          " " +
          currentLine[currentLine.length - 1];
        wordChoices = wordAfterSingle(
          prefix,
          suffixMap2,
          lineSyls,
          targetSyls,
          corpus
        );
        while (word_choices.length == 0) {
          index = Math.floor(Math.random() * corpus.length - 2); //random.randint(0, corpus.length - 2);
          prefix = corpus[index] + " " + corpus[index + 1];
          logging.debug("new random prefix = %s", prefix);
          word_choices = word_after_double(
            prefix,
            suffix_map_2,
            line_syls,
            target_syls
          );
        }
        // # word = random.choice(word_choices)
        // # num_syls = count_syllables(word)

        const { word, numSyls } = getNumSyls(wordChoices);

        console.log("ho", word, numSyls);

        if (numSyls == 0) {
          continue;
        } else if (lineSyls + numSyls > targetSyls) {
          continue;
        } else if (lineSyls + numSyls < targetSyls) {
          currentLine.concat(word);
          lineSyls += numSyls;
        } else if (lineSyls + numSyls === targetSyls) {
          currentLine.concat(word);
          break;
        }
      }

      endPrevLine = [];
      endPrevLine.concat(currentLine.slice(currentLine.length - 2));

      if (line == "1") {
        finalLine = [...currentLine];
      } else {
        finalLine = currentLine.slice(2);
      }

      return finalLine, endPrevLine;
    };

    const randomWord = (corpus) => {
      console.log("random");
      // ????
      // random.seed(random.randint(1, 7000));
      // let word = random.choice(corpus)
      let word = corpus[Math.floor(Math.random() * corpus.length)];
      //
      console.log({ corpus, word });

      let numSyls = countSyllables(word, corpus);
      console.log({ word, numSyls });

      if (numSyls > 4) {
        randomWord(corpus);
      } else if (numSyls == 0) {
        randomWord(corpus);
      } else {
        console.log("here there");
        return { word, numSyls };
      }
    };

    const wordAfterSingle = (
      prefix,
      suffixMap,
      currentSyls,
      targetSyls,
      corpus
    ) => {
      const acceptedWords = [];
      let suffixes = suffixMap[prefix];
      if (suffixes) {
        console.log("suffixes", suffixes);

        for (let candidate of suffixes) {
          console.log("candidate", candidate);

          let numSyls = countSyllables(candidate, corpus);
          console.log({ numSyls, currentSyls, targetSyls });
          if (currentSyls + numSyls <= targetSyls) {
            acceptedWords.concat(candidate);
          }
        }
      }
      return acceptedWords;
    };

    const final = [];
    const endPrevLine = [];
    let line, endPrevLine2;
    const { firstLine, endPrevLine1 } = constructHaikuLine(
      suffixMap1,
      suffixMap2,
      corpus,
      endPrevLine,
      5
    );
    final.concat(firstLine);
    ({ line, endPrevLine2 } = constructHaikuLine(
      suffixMap1,
      suffixMap2,
      corpus,
      endPrevLine1,
      7
    ));
    final.concat(line);

    ({ line } = constructHaikuLine(
      suffixMap1,
      suffixMap2,
      corpus,
      endPrevLine2,
      5
    ));

    final.concat(line);
    console.log({ final });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>nyaiku</title>
        <meta name="description" content="Generated by create next app" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🗽</text></svg>"
        ></link>
      </Head>

      <main className={styles.main}>
        <button className={styles.description} onClick={generate}>
          generate haiku
        </button>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
};

export async function getStaticProps() {
  // const scrapedData = ourScraper.scrape()
  // const phoneme_str = cmudict.get("people's");

  let text = "";

  const { data } = await axios.get(
    // `https://api.nytimes.com/svc/community/v3?api-key=${process.env.API_KEY}`
    `https://api.nytimes.com/svc/topstories/v2/food.json?api-key=${process.env.API_KEY}`
    // `https://api.nytimes.com/svc/community/v3/user-content/url.json?api-key=${process.env.API_KEY}&offset=0&url=https://www.nytimes.com/2019/06/21/science/giant-squid-cephalopod-video.html`
    // `https://api.nytimes.com/svc/news/v3/content/nyt/world.json?api-key=${process.env.API_KEY}`
  );

  const getComments = async () => {
    const results = await Promise.allSettled(
      data.results.map(async (result) => {
        const { data: data2 } = await axios.get(
          // `https://api.nytimes.com/svc/community/v3?api-key=${process.env.API_KEY}`
          `https://api.nytimes.com/svc/community/v3/user-content/url.json?api-key=${process.env.API_KEY}&offset=0&url=${result.url}`
          // `https://api.nytimes.com/svc/community/v3/user-content/url.json?api-key=${process.env.API_KEY}&offset=0&url=https://www.nytimes.com/2019/06/21/science/giant-squid-cephalopod-video.html`
          // `https://api.nytimes.com/svc/news/v3/content/nyt/world.json?api-key=${process.env.API_KEY}`
        );
        const comments = data2.results.comments.map((comment) =>
          comment?.commentBody
            .replace(/\?|!|,|;|\./g, "")
            .split("\n")
            .join(" ")
            // .replace(/\?|!|,|./g, "")
            .toLowerCase()
        );

        const dataResult = comments
          .join(" ")
          .split(" ")
          .filter((item) => item !== "");

        console.log({ dataResult });
        return dataResult;
      })
    );
    const successfulResults = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);

    const mergeDedupe = (arr) => {
      return [...new Set([].concat(...arr))];
    };

    const testWTF = mergeDedupe(successfulResults);

    return testWTF;
  };

  let corpus = await getComments();

  const mapWordToWord = (corpus) => {
    "Load list & use dictionary to map word to word that follows.";
    const limit = corpus.length - 1;
    const dict1To1 = {};
    // dict1_to_1 = defaultdict(list)
    corpus.forEach((word, index) => {
      if (index < limit) {
        const suffix = corpus[index + 1];
        dict1To1[word]
          ? dict1To1[word].push(suffix)
          : (dict1To1[word] = [suffix]);
      }
    });
    return dict1To1;
  };

  const map2WordsToWord = (corpus) => {
    "Load list & use dictionary to map word-pair to trailing word";
    const limit = corpus.length - 2;
    const dict2To1 = {};
    // dict1_to_1 = defaultdict(list)
    corpus.forEach((word, index) => {
      if (index < limit) {
        const key = word + " " + corpus[index + 1];
        const suffix = corpus[index + 2];
        dict2To1[key] ? dict2To1[key].push(suffix) : (dict2To1[key] = [suffix]);
      }
    });
    return dict2To1;
  };

  // const comments =
  //   "Did you notice how you always have to thoroughly marinate or sauce it to death to make it palatable?   There's a reason for that - it's natural flavor.  While I haven't had it in many years, there's a reason for that too - it tastes like chicken with an over/under taste of fish.  Just not my cup of tea, & I'm a fairly adventurous eater. I'm a vegetarian so naturally a bit biased, but there is something especially sad about these images compared to other meats. My teen was asked what might we look back on in 2050 and think it was strange we did it. She said eating meat. I hope she's right. Just another reason I'm a vegetarian. Thank you for this wonderful article! I know one or two things about alligators. But just when I thought I knew pretty much everything about my world, I read this piece.... And thank you for the pictures! Barbaric.  Proud to be a vegetarian since 1996.  I don't participate in things such as this. I am not a vegetarian and believe if you kill an animal, you should eat it. But the culinary preparation of the alligator was nauseating and disrespectful. The farm grown alligators are managed very responsibly. After hatching, a portion are returned to the swamps to ensure the population is sustained.  Plus, in addition to the meat, all of the leather is used.  Cypress is a great local South LA brand doing just that. The one problem with eating alligator is the taste.  Tried it several times, very gamey and you have to hide that with all those spices.  Also, most people who enjoy it live in the south, so there's another reason. Someone was pulling this writer's pirogue.   A roux, made from browning flour and fat and is the base of many Cajun & Creole dishes. It is certainly not a condiment. However, a remoulade is made from a mayo base with many other seasonings and spices.   Nevertheless, it looked like good fun and great food.   Yrs, a LSU grad. This is disgusting. The lack of compassion and empathy for this creature is cringe-worthy. And Americans like to say the people of Asia are the cruel eaters ... I have only one word: Revolting. But, bon appétit to the eaters of reptile flesh, raw or cooked. Shouldn't they be called tailgators? Will the Bleeding Hearts kindly stick to Blood Sausage (boudin) and let the rest of us eat in peace? Chomp! Please stop consuming the planet for superfluous purposes.  Leave the alligators alone. what's the taste difference like in a Florida gator and one out of Louisiana? A man can live and be healthy without killing animals for food; therefore, if he eats meat, he participates in taking animal life merely for the sake of his appetite. - Tolstoy Thanks for exposing this.  I am calling it Tailgate. Seems ripe for weird animal to human disease spread.  Like pangolins and bats. Visit tailgate parties in Jacksonvill, FL in October during the annual UGA vs. University of FL. pretty much every UGA tailgate will have alligator on the menu. Better or worse than eating a battered, fried nugget from a chicken that spent its life in a mega-farm-factory? Dirty Jobs did an episode at an Alligator Farm in LA.    Its seared in my mind. I was born in northern Florida, and my family goes back generations there (I've since left) and I grew up in Gainesville. Always been a Gators fan.  And I've often enjoyed gator too. My father cooked a mean chili with gator meat, and served it battered as well.  I'm pleased that LSU fans respect our culinary tastes and respect the Gators too! I had the buffalo-sauce style gator bites at Cochon in New Orleans a few years ago, and they were amazing. Highly recommend. It's a cliche, but depending on how you prepare it, alligator tastes a lot like chicken.";

  const suffixMap1 = mapWordToWord(corpus);
  const suffixMap2 = map2WordsToWord(corpus);

  console.log({ corpus });

  return {
    props: {
      corpus,
      suffixMap1,
      suffixMap2,
    },
    revalidate: 86400, // once a  day
  };
}

export default Home;
