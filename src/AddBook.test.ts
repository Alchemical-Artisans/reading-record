import { describe, expect, test } from "vitest";
import { Book, extractVolumeIDFrom, InvalidUrl, MarkdownFile } from "./AddBook.ts";

const response_json = {
  "kind": "books#volume",
  "id": "wRV_EAAAQBAJ",
  "etag": "ZOdAdXEgwV0",
  "selfLink": "https://www.googleapis.com/books/v1/volumes/wRV_EAAAQBAJ",
  "volumeInfo": {
    "title": "Matchmaking a Grump",
    "authors": [
      "Angela Casella",
      "Denise Grover Swank"
    ],
    "publisher": "Laughing Heart Press",
    "publishedDate": "2022-10-31",
    "description": "\u003cp\u003eHe wants to destroy her show. She wants to get on Santa’s naughty list with him.\u003c/p\u003e\u003cp\u003eRowan\u003c/p\u003e\u003cp\u003eNo man wants to be nicknamed Cupid. My family’s run a matchmaking business for years, though, and my sister’s a romance novelist. You get the picture. To make matters worse, my narcissistic grandmother just sold a reality dating show to network television. Thanks to her, our small town is about to become a hotbed of tourists and opportunists.\u003c/p\u003e\u003cp\u003eHer show needs to be stopped, and I’m exactly the man to do it. Cupid, reporting for duty\u003c/p\u003e\u003cp\u003eThe star of the show, Kennedy Littlefield, isn’t my type at all. She’s a wealthy heiress with an unhealthy obsession with Christmas.\u003c/p\u003e\u003cp\u003eThere’s just one problem: I can’t stop thinking about her.\u003c/p\u003e\u003cp\u003eKennedy\u003c/p\u003e\u003cp\u003eI’m lucky to be doing this show. Maybe I’ll start believing it if I repeat it enough...because I’m supposed to be dating eight men, and they all suck. I’m not here to fall in love—I’m trying to save a non-profit with the publicity from the show—but I’d hoped for a Christmas miracle.\u003c/p\u003e\u003cp\u003eI love Christmas, only it hasn’t come to the set because the show doesn’t air until spring, and no one—with the exception of me—wants to watch a Christmas show in March.\u003c/p\u003e\u003cp\u003eThere’s only one thing I want more than Christmas cheer: the ornery grump who keeps hanging out around the set.\u003c/p\u003e",
    "industryIdentifiers": [
      {
        "type": "ISBN_10",
        "identifier": "1940562678"
      },
      {
        "type": "ISBN_13",
        "identifier": "9781940562674"
      }
    ],
    "readingModes": {
      "text": true,
      "image": true
    },
    "pageCount": 350,
    "printedPageCount": 365,
    "printType": "BOOK",
    "categories": [
      "Fiction / Romance / Romantic Comedy",
      "Fiction / Romance / Contemporary",
      "Fiction / Romance / General",
      "Fiction / Romance / Holiday"
    ],
    "maturityRating": "NOT_MATURE",
    "allowAnonLogging": false,
    "contentVersion": "0.9.10.0.preview.3",
    "panelizationSummary": {
      "containsEpubBubbles": false,
      "containsImageBubbles": false
    },
    "imageLinks": {
      "smallThumbnail": "http://books.google.com/books/publisher/content?id=wRV_EAAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&imgtk=AFLRE73_W9aGpFifNkuRsKIkNAm42rvl7X8Gp4oJSUGFcPkzPyi_ErUVp6zMA7qDpXA1IPgqOiHxFmuh4FOQH8-J2TI4_oi_DGzaMwu6g6_je58U1QzBsUjFXxJC-9E3y_YW9w6fKU85&source=gbs_api",
      "thumbnail": "http://books.google.com/books/publisher/content?id=wRV_EAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE72cf2sJj7uRs_s8m37uUHRNCXP3tD9qIQMvFHSAUmIaje9LhWXdbF98N9_cTqkOG1Zxhye8E-g7JaHSh15LtEyhRVauuvqwC16iXFPo6zwaF8iXKj15UPwadt0jr_aVQlmEnLJO&source=gbs_api",
      "small": "http://books.google.com/books/publisher/content?id=wRV_EAAAQBAJ&printsec=frontcover&img=1&zoom=2&edge=curl&imgtk=AFLRE70tuvv_VEt0LpLrmhmW5I3bjr-iCKBqSGZVC0FIuScKw20UwW9gccgnzmqytg5pU1XEJP4r438zAjuzeEEOyp_y83eV7nCKBBiMWLZ3MqqjZ5HdKW7kwu9YaPCBT0v1hR9ouR_n&source=gbs_api",
      "medium": "http://books.google.com/books/publisher/content?id=wRV_EAAAQBAJ&printsec=frontcover&img=1&zoom=3&edge=curl&imgtk=AFLRE73x3hITgRoBR5UZ5D0xgS9UuHDrI0AyI98nfBv5qDDzGRnTPTYTqI2slCL4_T-qiDa7r_RoHhSlENv-IfFBUNCK9mVfHkHu0Pn4rrSgdQ_nSTD7O3d00CUwhMkKEYTVSymBht6l&source=gbs_api",
      "large": "http://books.google.com/books/publisher/content?id=wRV_EAAAQBAJ&printsec=frontcover&img=1&zoom=4&edge=curl&imgtk=AFLRE71UbY_Mt12Me7BskLYfYGd7mmNdCmTcBQUgYb8zSa_Ck6ClOGfXF_2k-5UOnE0NV92IkMt9rW0XTcNuMR6_shkiINwa0SQSmYQlgnfMTYzCD0GdbL5EhuATB508cBy-k02fUBPg&source=gbs_api",
      "extraLarge": "http://books.google.com/books/publisher/content?id=wRV_EAAAQBAJ&printsec=frontcover&img=1&zoom=6&edge=curl&imgtk=AFLRE71G4rgdJjT3gNWsbcVwCxYyiOI1TKoHlATWZ2XtXBNFc2TKROEAdRey2BfzEAi72FerDtEAVvUw5akHjjDwHb_RQNFlZayfZ2jj_7BYwyNJX8WslmRx2jp7q_olmwYlOwBzfM8P&source=gbs_api"
    },
    "language": "en",
    "previewLink": "http://books.google.com/books?id=wRV_EAAAQBAJ&hl=&source=gbs_api",
    "infoLink": "https://play.google.com/store/books/details?id=wRV_EAAAQBAJ&source=gbs_api",
    "canonicalVolumeLink": "https://play.google.com/store/books/details?id=wRV_EAAAQBAJ"
  },
  "layerInfo": {
    "layers": [
      {
        "layerId": "geo",
        "volumeAnnotationsVersion": "11"
      }
    ]
  },
  "saleInfo": {
    "country": "US",
    "saleability": "NOT_FOR_SALE",
    "isEbook": false
  },
  "accessInfo": {
    "country": "US",
    "viewability": "PARTIAL",
    "embeddable": true,
    "publicDomain": false,
    "textToSpeechPermission": "ALLOWED",
    "epub": {
      "isAvailable": true,
      "acsTokenLink": "http://books.google.com/books/download/Matchmaking_a_Grump-sample-epub.acsm?id=wRV_EAAAQBAJ&format=epub&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api"
    },
    "pdf": {
      "isAvailable": true,
      "acsTokenLink": "http://books.google.com/books/download/Matchmaking_a_Grump-sample-pdf.acsm?id=wRV_EAAAQBAJ&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api"
    },
    "webReaderLink": "http://play.google.com/books/reader?id=wRV_EAAAQBAJ&hl=&source=gbs_api",
    "accessViewStatus": "SAMPLE",
    "quoteSharingAllowed": false
  }
}

describe("extract volume id", () => {
  test("pull an ID out of a correctly structured URL", () => {
    const volume_id = extractVolumeIDFrom("https://www.google.com/books/edition/Pride_and_Prejudice/hJFnbfr43bcC?hl=en&gbpv=0")
    expect(volume_id).toEqual("hJFnbfr43bcC")
  })

  test("throw an error if no match is found", () => {
    expect(() => extractVolumeIDFrom("https://example.com/bad")).toThrow(InvalidUrl);
  })

  test("throw an error if no id is specified", () => {
    expect(() => extractVolumeIDFrom("https://www.google.com/books/edition/Pride_and_Prejudice/?hl=en&gbpv=0")).toThrow(InvalidUrl)
  })

  test("extracts an ID if no querystring is set", () => {
    expect(extractVolumeIDFrom("https://www.google.com/books/edition/Pride_and_Prejudice/hJFnbfr43bcC")).toEqual("hJFnbfr43bcC")
  })
})

describe("parse Books response", () => {
  test("extracts components from response", () => {
    const book = Book.parse(response_json)
    expect(book.title).toEqual("Matchmaking a Grump")
    expect(book.authors).toEqual([
      "Angela Casella",
      "Denise Grover Swank"
    ])
    expect(book.cover).toEqual("https://books.google.com/books/publisher/content?id=wRV_EAAAQBAJ&printsec=frontcover&img=1&zoom=2&edge=curl&imgtk=AFLRE70tuvv_VEt0LpLrmhmW5I3bjr-iCKBqSGZVC0FIuScKw20UwW9gccgnzmqytg5pU1XEJP4r438zAjuzeEEOyp_y83eV7nCKBBiMWLZ3MqqjZ5HdKW7kwu9YaPCBT0v1hR9ouR_n&source=gbs_api")
  })
})

describe("generate markdown", () => {
  test("filename is title", () => {
    const book = new Book({ title: "Dune" })
    expect(book.markdown().file_name).toEqual("Dune.md")
  })

  test("frontmatter includes cover URL", () => {
    const book = new Book({ title: "example", cover: "https://example.com/cover.png" });
    expect(book.markdown().frontmatter["Cover"]).toEqual(book.cover)
  })

  test("frontmatter includes authors", () => {
    const book = new Book({ title: "example", authors: ["Angela Casella", "Denise Grover Swank"] });
    expect(book.markdown().frontmatter["Authors"]).toEqual(["[[Angela Casella]]", "[[Denise Grover Swank]]"])
  })

  describe("frontmatter generation", () => {
    test("string", () => {
      const markdown = new MarkdownFile({
        file_name: "foo.md",
        frontmatter: { a: "x" },
      })
      expect(markdown.toString()).toEqual("---\na: x\n---\n")
    })

    test("array", () => {
      const markdown = new MarkdownFile({
        file_name: "foo.md",
        frontmatter: { a: ["x", "y"] },
      })
      expect(markdown.toString()).toEqual("---\na:\n  - x\n  - y\n---\n")
    })
  })
})
