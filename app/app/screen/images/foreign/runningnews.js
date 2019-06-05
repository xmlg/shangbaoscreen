/**
 * Created by Administrator on 2016-12-06.
 */
function getAlchemyNewsData(url,e, t, n, i, a, o, r, s, l) {
    //  console.log("invoking alchemy news service on " + e + " for " + a + " articles with titleOnly //= " + i);
    console.log("getAlchemyNewsData in html..")
    var c = ["current events", "art and entertainment", "business and industrial", "education", "finance", "health and fitness", "law, government and politics", "religion and spirituality", "science", "sports", "technology and computing"];
    e = removeDiacritics(e);
    var u = null;
    if (void 0 == s && (s = !0), null == e || 0 === e.length) return void r({
            nodes: [],
            links: []
        },
        "failed to load data: query with no subject");
    var d = _.contains(c, decodeURIComponent(e).toLowerCase());
    d && ("law%2c%20government%20and%20politics" == e.toLowerCase() && (e = "law,%20govt%20and%20politics"), u = e.toLowerCase());
    var p = "",
        h = new Date,
        g = new Date(h - 1e3 * n * 60 * 60 * 24);
    if (useRestServer) p = restServerURL + "/api/news/?",
        d ? p += "category=" + e.toLowerCase() : (p += "query=" + e, null != t && (p += "&type=" + t), null != i && (p += "&searchTitleOnly=" + i)),
    null != a && (p += "&num=" + a),
    null != n && (p += "&days=" + n),
    null != o && (p += "&selection=" + o),
    null != l && l.length > 0 && ("law%2c%20government%20and%20politics" == l.toLowerCase() && (l = "law,%20govt%20and%20politics"), p += "&category=" + l);
    else {
        var y = "";
        null != e && e.length > 0 && (d ? (y = "current%20events" == e.toLowerCase() ? "": i ? "law,%20govt%20and%20politics" == e.toLowerCase() ? "&q.enriched.url.enrichedTitle.taxonomy.taxonomy_.label=" + e.toLowerCase() : "&q.enriched.url.taxonomy.taxonomy_=|label=" + e.toLowerCase() + ",score=>0.7|": "law,%20govt%20and%20politics" == e.toLowerCase() ? "&q.enriched.url.taxonomy.taxonomy_.label=" + e.toLowerCase() : "&q.enriched.url.taxonomy.taxonomy_=|label=" + e.toLowerCase() + ",score=>0.7|", y += "&q.enriched.url.url=[nytimes^washingtonpost^sfchronicle^usatoday^bostonglobe^chron^pbs]") : (y = i ? "&q.enriched.url.enrichedTitle.entities.entity=|text=" + e: "&q.enriched.url.entities.entity=|text=" + e, null != t && (y += ",type=" + t), y += "|")),
            p = "https://access.alchemyapi.com/calls/data/GetNews?apikey=edd60853a78c2a0e33859cfff509999b2012ca19&return=enriched.url.cleanedTitle,enriched.url.url,enriched.url.author,enriched.url.publicationDate,enriched.url.text,enriched.url.entities,enriched.url.concepts,enriched.url.keywords,enriched.url.taxonomy,enriched.url.docSentiment&start=now-" + n + "d&end=now" + y + "&count=" + 2 * a + "&outputMode=json"
    }
    null != ajaxRequest && (ajaxRequest.abort(), ajaxRequest = null),

        // p="images/foreign/news_c20_n100_d7.json";
       p= url==null?"/wcm/bigdata.do?modelid=overseasMedia1&serviceid=overseas&typeid=widget&user_id=admin&department=admin":url

    // p="images/foreign/news_c20_n100_d7.json"
   // p="/wcm/bigdata.do?modelid=dpxs&serviceid=hotsearch&typeid=widget&user_id=admin&department=admin";
    ajaxRequest = $.getJSON(p,
        function(t, n) {
            var i = {
                nodes: [],
                links: []
            };
          //  console.log(n);console.log(t);
            if (ajaxRequest = null, "success" === n && ("OK" === t.status ? i = useRestServer ? t: convertAlchemyData(t, g, h, s, a, u) : n = t.statusInfo), !d) {
                var o = findNode(decodeURIComponent(e), i.nodes);
                null != o && (o.forceVisible = !0)
            }
             setTimeout(function(){
                r(i, n),
                    ga("send", {
                        hitType: "event",
                        eventCategory: "query",
                        eventAction: "AlchemyNewsQuery"
                    })
             }, 1200 );

        })
}
function getAlchemyConnections(e, t, n, i, a, o, r, s) {
    var l, c = [],
        u = [];
    console.log("getAlchemyConnections js 58 ..")
    if (useRestServer) {
        if (null == e || 0 === e.length) return void s({
                nodes: [],
                links: []
            },
            "failed to load data: connections query with no first subject");
        if (null == n || 0 === n.length) return void s({
                nodes: [],
                links: []
            },
            "failed to load data: query with no second subject");
        query = restServerURL + "/api/news/?",
            query += "query=" + e,
        null != t && (query += "&type=" + t),
            query += "&target=" + n,
        null != i && (query += "&targetType=" + i),
        null != o && (query += "&searchTitleOnly=" + o),
        null != r && (query += "&num=" + r),
        null != a && (query += "&days=" + a),
        null != ajaxRequest && (ajaxRequest.abort(), ajaxRequest = null),
            ajaxRequest = $.getJSON(query,
                function(t, i) {
                    ajaxRequest = null,
                        "success" === i ? processConnectionResults(t, i, e, n, s) : s(t, i)
                })
    } else getAlchemyNewsData(null,e, t, a, o, r,
        function(t, d) {

            l = d,
                "success" === d ? getAlchemyNewsData(null, i, a, o, 2 * r,
                    function(t, i) {
                        processConnectionResults(t, i, e, n, s)
                    },
                    !1) : s({
                        nodes: c,
                        links: u
                    },
                    d)
        })
}
function processConnectionResults(e, t, n, i, a) {
    if (overallStatus = t, "success" === t) {
        nodes = e.nodes,
            links = e.links;
        var o = findNode(decodeURIComponent(n), nodes),
            r = findNode(decodeURIComponent(i), nodes);
        if (void 0 != o && void 0 != r) {
            o.forceVisible = !0,
                r.forceVisible = !0,
                o.persistentLabel = !0,
                r.persistentLabel = !0;
            var e = filterPath(o, r, nodes, links);
            nodes = e.nodes,
                links = e.links;
            var s = [],
                l = 0;
            _.each(nodes,
                function(e) {
                    0 === e.filtered && e != o && e != r && (2 === e.depth && 4 === e.pathLength || 1 === e.depth && 2 === e.pathLength) && (e.middle = !0, s.push(e), l += nodeSize(e))
                }),
                _.each(links,
                    function(e) {
                        var t = nodes[e.source],
                            n = nodes[e.target];
                        "article" === t.type && "article" !== n.type && t.middle && n.middle && (n.middle = !1, s = _.without(s, n), l -= nodeSize(n))
                    }),
                _.each(links,
                    function(e) {
                        var t = nodes[e.source],
                            n = nodes[e.target],
                            i = 0;
                        "article" === t.type && (n === o ? i = 4 : n === r ? i = 2 : n.middle && (i = 1), 0 != i && (null != t.contextCode ? t.contextCode |= i: t.contextCode = i))
                    });
            var c = 375,
                u = network.height / 2 - (l / 2 + 3 * s.length);
            s = _.sortBy(s, "pathLength");
            var d;
            d = r.pathLength > 4 ? 1e3 * r.pathLength: s.length > 10 ? 2 * (l + 10 * s.length) : 5e3,
                o.x = -d / 2,
                o.fixed = !0,
                o.y = network.height / 2,
                r.fixed = !0,
                r.x = d / 2,
                r.y = network.height / 2;
            var c = 0;
            _.each(s,
                function(e) {
                    size = nodeSize(e),
                        u += size / 2,
                        e.fixed = !0,
                        e.x = c,
                        e.y = u,
                        u += size / 2 + 6
                }),
            0 == e.nodes.length && (overallStatus = "could not find connection", e = {
                nodes: nodes,
                links: links
            }),
                a(e, overallStatus)
        } else t = void 0 == o ? "Could not find " + decodeURIComponent(n) : "Could not find " + decodeURIComponent(i),
            a({
                    nodes: nodes,
                    links: links
                },
                t)
    }
}
function convertAlchemyData(e, t, n, i, a, o) {
    //  console.log("Converting Alchemy Data"),
    i && (entityMap = {},
        id = 0, nodes = [], links = []);
    var r = e.result.docs || [],
        s = [];
    null != o && (o = decodeURIComponent(o));
    for (var l = 0; l < r.length && !(s.length >= a); l++) {
        var c = r[l],
            u = c.source;
        if (null != u && (u = u.enriched, null != u && (u = u.url, null != u))) {
            var d = null,
                p = null;
            null != c.timestamp && (p = new Date(1e3 * c.timestamp), d = p.toString());
            var h = null,
                g = !0;
            if (u.taxonomy.length > 0) {
                var y = u.taxonomy[0].label,
                    f = y.lastIndexOf("/");
                h = y.substr(f + 1),
                null != o && ("current events" == o ? (y.indexOf("sports") >= 0 || y.indexOf("art and entertainment") >= 0 || y.indexOf("real estate") >= 0) && (g = !1) : y.indexOf(o) < 0 && (g = !1))
            }
            if (null != p && p >= t && n >= p && g && !_.find(s,
                    function(e) {
                        return e.cleanedTitle.toLowerCase() === u.cleanedTitle.toLowerCase()
                    })) {
                var m = {
                    id: id,
                    name: u.cleanedTitle,
                    date: d,
                    author: u.author,
                    type: "article",
                    summary: u.text,
                    source: u.url,
                    sentiment: u.docSentiment.score,
                    degree: 0
                };
                null != h && (m.category = h),
                    u.id = id++,
                    nodes.push(m),
                    s.push(u);
                var v = u.entities,
                    b = 0;
                _.each(v,
                    function(e) {
                        var t = e.text,
                            n = null;
                        if (7 > b) {
                            var i = null,
                                a = null,
                                o = null,
                                r = null;
                            if ("Person" === e.type ? i = "person": "Organization" === e.type ? i = "organization": "Company" === e.type ? i = "company": ("City" === e.type || "State" === e.type || "StateOrCountry" === e.type || "Country" === e.type || "Region" === e.type) && (i = "location", r = e.type, null != e.disambiguated.geo && e.disambiguated.geo.length > 0 && (o = e.disambiguated.geo)), null != e.disambiguated.dbpedia && (a = e.disambiguated.dbpedia), null != e.disambiguated.name && t !== e.disambiguated.name && (n = normalizeName(t).toLowerCase(), t = e.disambiguated.name), t = normalizeName(t), null != i) {
                                var s = null;
                                if (null != a ? (s = entityMap[a], null == s ? (s = entityMap[t.toLowerCase()], null == s && (s = entityMap[n]), null != s && (s.source = a, entityMap[a] = s, entityMap[t.toLowerCase()] = s, null != n && (entityMap[n] = s))) : null !== n && (entityMap[n] = s)) : s = entityMap[t.toLowerCase()], null == s) {
                                    if (null == a && "person" == i && t.indexOf(" ") < 0) return;
                                    s = {
                                        id: id++,
                                        name: t,
                                        type: i,
                                        degree: 0
                                    },
                                        nodes.push(s),
                                    null != a && (entityMap[a] = s),
                                        entityMap[t.toLowerCase()] = s
                                }
                                null != a && (s.source = a, s.type = i),
                                null != o && (s.geo = o),
                                null != r && (s.locationType = r);
                                var l = _.find(links,
                                    function(e) {
                                        return e.source == m.id && e.target == s.id
                                    });
                                if (null != l) return;
                                m.degree++,
                                    s.degree++;
                                var c = {
                                    id: links.length,
                                    source: m.id,
                                    target: s.id,
                                    value: 1
                                };
                                links.push(c),
                                    b++
                            }
                        }
                    })
            }
        }
    }
    _.each(s,
        function(e) {
            var t = nodes[e.id],
                n = e.concepts;
            _.each(n,
                function(e) {
                    var n = e.text;
                    if (!filtered(n) && e.relevance > .7) {
                        var i = e.knowledgeGraph.typeHierarchy,
                            a = "undetermined";
                        if (null != i) {
                            var o = i.indexOf("/", 1);
                            a = i.substr(1, o - 1)
                        }
                        if ("organizations" === a);
                        else if ("companies" === a);
                        else if ("locations" === a || "places" === a);
                        else if ("people" === a);
                        else if ("undetermined" == a);
                        else {
                            var r = entityMap[n.toLowerCase()];
                            if (null == r) r = {
                                id: id++,
                                name: n,
                                type: "concept",
                                degree: 0
                            },
                                nodes.push(r),
                                entityMap[n.toLowerCase()] = r;
                            else if ("concept" !== r.type) return;
                            r.degree++,
                                t.degree++;
                            var s = {
                                id: links.length,
                                source: t.id,
                                target: r.id,
                                value: 1
                            };
                            links.push(s)
                        }
                    }
                });
            var i = e.keywords;
            _.each(i,
                function(e) {
                    var n = e.text;
                    if (!filtered(n) && e.relevance > .9) {
                        var i = e.knowledgeGraph.typeHierarchy,
                            a = "undetermined";
                        if (null != i) {
                            var o = i.indexOf("/", 1);
                            a = i.substr(1, o - 1)
                        }
                        if ("organizations" === a);
                        else if ("companies" === a);
                        else if ("locations" === a || "places" === a);
                        else if ("people" === a);
                        else if ("undetermined" == a);
                        else {
                            var r = entityMap[n.toLowerCase()];
                            if (null == r) r = {
                                id: id++,
                                name: n,
                                type: "concept",
                                degree: 0
                            },
                                nodes.push(r),
                                entityMap[n.toLowerCase()] = r;
                            else {
                                if ("concept" !== r.type) return;
                                var s = _.find(links,
                                    function(e) {
                                        return e.source == r.id && e.target == r.id
                                    });
                                if (null != s) return
                            }
                            r.degree++,
                                t.degree++;
                            var l = {
                                id: links.length,
                                source: t.id,
                                target: r.id,
                                value: 1
                            };
                            links.push(l)
                        }
                    }
                })
        }),
        _.each(nodes,
            function(e) {
                e.radius = nodeSize(e) / 2
            });
    var C = {
        nodes: nodes,
        links: links
    };
    return console.log("Converted to " + nodes.length + " nodes, " + links.length + " links"),
        C
}
function filtered(e) {
    return null != e.match("\\d{4} albums") || null != e.match("\\d{4} singles") || null != e.match("\\d{4}s music groups") || null != e.match("\\d{4}") || 0 === e.indexOf("Billboard") || "Debut singles" === e || "Debut albums" === e || "That that is is that that is not is not is that it it is" === e || "Thing" === e || "A Good Thing" === e || "American films" === e || "English-language films" === e || "Existential quantification" === e || "Universal quantification" === e || "All That You Can't Leave Behind" === e || "If You Have to Ask" === e || "A Little Bit" === e || "Gazette" === e || "Newspaper" === e || "Receipt" === e || "2" === e || "Bismuth-209" === e || "Paste" === e || "Ciara" === e || "YOU" === e || "LOOK" === e || "WANT" === e || "Want" === e || "Need to know" === e || "Doing It" === e || "A Little Bit Longer" === e || "Hope That We Can Be Together Soon" === e || "Comment" === e || "Hour" === e || "All Things Considered" === e || "According to Jim" === e || "Login" === e || "Access code" === e || "Copyright" === e || "All rights reserved" === e || "Lead paragraph" === e || "Constable" === e || "Sheriff" === e || 0 == e.indexOf("Mr") || 0 == e.indexOf("Mrs") || 0 == e.indexOf("Dr.") || "Sexual arousal" === e || "Sexology" === e || "Human sexual behavior" === e || "Horny" === e || "Oral sex" === e || "Vagina" === e || "Orgasm" === e || "Sex" === e || "Human sexuality" === e || "Penis" === e || "Mastur bation" === e || "Feminine hygiene" === e || "Sexually transmitted diseases" === e || "Incest" === e || "Sexual intercourse" === e || "Anal Sex" === e || "Fuck" === e ? !0 : !1
}
function normalizeName(e) {
    var t = ["dr. ", "dr ", "mr ", "mr. ", "mrs ", "mrs.", "miss ", "ms ", "ms. ", "president ", "vice president ", "ceo ", "chef ", "rep ", "rep. ", "representative ", "senator ", "governor ", "gov. ", "general ", "prime minister "],
        n = [" inc", " inc.", " corp", " corp.", " corporation", " group", " health"],
        i = e.toLowerCase(),
        a = i.length;
    return _.each(t,
        function(t) {
            0 == i.indexOf(t) && (e = e.substring(t.length))
        }),
        _.each(n,
            function(t) {
                var n = i.indexOf(t);
                n > 0 && n == a - t.length && (e = e.substring(0, e.length - t.length))
            }),
        e = e.replace("�?", "'"),
        e.trim()
}
function filterPath(e, t, n, i) {
    var a = !1,
        o = [];
    findPaths(e, t, n, i, 0, 4, o) == Number.MAX_VALUE && (o = findPath(e, t, n, i), a = !0);
    var r = [];
    _.each(o,
        function(e) {
            e.filtered = 0,
            a && (e.contextCode = 7),
                r.push(e)
        }),
        _.each(i,
            function(e) {
                var t = n[e.source],
                    i = n[e.target];
                0 === t.filtered && void 0 == i.filtered && (i.filtered = 1, r.push(i))
            }),
        _.each(i,
            function(e) {
                var t = n[e.source],
                    i = n[e.target];
                1 !== t.filtered || "article" !== t.type || i.filtered || "concept" !== i.type && "location" != i.type || (i.filtered = 2, r.push(i))
            });
    for (var s = _.filter(i,
        function(e) {
            var t = n[e.source],
                i = n[e.target];
            return null != t.filtered && null != i.filtered
        }), l = 0; l < r.length; l++) r[l].id = l;
    return _.each(s,
        function(e) {
            e.source = n[e.source].id,
                e.target = n[e.target].id
        }),
    {
        nodes: r,
        links: s
    }
}
function findPath(e, t, n, i) {
    var a = [];
    e.pathLength = 0;
    for (var o = e; null != o;) {
        var r = [],
            s = o.pathLength + 1;
        if ("article" === o.type ? _.each(i,
                function(e) {
                    if (e.source === o.id) {
                        var i = n[e.target]; ("concept" !== i.type && "location" !== i.type || i === t) && r.push(i)
                    }
                }) : _.each(i,
                function(e) {
                    if (e.target === o.id) {
                        var i = n[e.source]; ("concept" !== i.type && "location" != i.type || i === t) && r.push(i)
                    }
                }), _.each(r,
                function(e) { (void 0 == e.pathLength || e.pathLength > s) && (e.pathLength = s, e.predecessor = o.id, e.visited || _.contains(a, e) || a.push(e))
                }), o.visited = !0, a = _.without(a, o), !(a.length > 0)) {
            o = null;
            break
        }
        if (o = _.min(a,
                function(e) {
                    return e.pathLength
                }), o == t || null == o) break
    }
    var l = [];
    if (null != o) for (l.push(o); null != o.predecessor;) o = n[o.predecessor],
        l.push(o);
    return l
}
function findPaths(e, t, n, i, a, o, r) {
    var s = Number.MAX_VALUE;
    return 0 === a && (nameMap = []),
    (null == e.depth || e.depth > a) && (e.depth = a),
        e === t ? a: (a += 1, a > o ? s: (_.each(i,
            function(l) {
                if (!l.onCurrentPath) {
                    var c = n[l.source],
                        u = n[l.target],
                        d = null;
                    if (e === c ? d = u: e === u && (d = c), null != d && (l.onCurrentPath = !0), null != d && ("location" !== d.type && "concept" != d.type && "Untitled Document" !== d.name || d === t) && (null == d.depth && null == nameMap[d.name] || d.depth >= a || d === t)) {
                        nameMap[d.name] = d;
                        var p = findPaths(d, t, n, i, a, o, r); (null == d.pathLength || d.pathLength > p) && (d.pathLength = p),
                            s = Math.min(p, s),
                        o >= p && null == d.filtered && (d.filtered = 0, r.push(d))
                    }
                    l.onCurrentPath = !1
                }
            }), o >= s && 1 === a && (e.filtered = 0, r.push(e)), s))
}
function findNode(e, t) {
    var n = e.toLowerCase(),
        i = _.find(t,
            function(e) {
                if ("article" !== e.type) {
                    if (e.name.toLowerCase() === n) return ! 0;
                    if (null != e.alias && _.contains(e.alias, n)) return ! 0
                }
            });
    return null == i && (i = entityMap[n]),
        i
}
function findArticleNode(e, t) {
    // console.log("looking for " + e);
    var n = _.find(t,
        function(t) {
            return "article" === t.type && 0 == t.source.indexOf(e)
        });
    return n
}
function removeDiacritics(e) {
    e = decodeURIComponent(e);
    for (var t = [{
        base: "A",
        letters: /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g
    },
        {
            base: "AA",
            letters: /[\uA732]/g
        },
        {
            base: "AE",
            letters: /[\u00C6\u01FC\u01E2]/g
        },
        {
            base: "AO",
            letters: /[\uA734]/g
        },
        {
            base: "AU",
            letters: /[\uA736]/g
        },
        {
            base: "AV",
            letters: /[\uA738\uA73A]/g
        },
        {
            base: "AY",
            letters: /[\uA73C]/g
        },
        {
            base: "B",
            letters: /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g
        },
        {
            base: "C",
            letters: /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g
        },
        {
            base: "D",
            letters: /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g
        },
        {
            base: "DZ",
            letters: /[\u01F1\u01C4]/g
        },
        {
            base: "Dz",
            letters: /[\u01F2\u01C5]/g
        },
        {
            base: "E",
            letters: /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g
        },
        {
            base: "F",
            letters: /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g
        },
        {
            base: "G",
            letters: /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g
        },
        {
            base: "H",
            letters: /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g
        },
        {
            base: "I",
            letters: /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g
        },
        {
            base: "J",
            letters: /[\u004A\u24BF\uFF2A\u0134\u0248]/g
        },
        {
            base: "K",
            letters: /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g
        },
        {
            base: "L",
            letters: /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g
        },
        {
            base: "LJ",
            letters: /[\u01C7]/g
        },
        {
            base: "Lj",
            letters: /[\u01C8]/g
        },
        {
            base: "M",
            letters: /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g
        },
        {
            base: "N",
            letters: /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g
        },
        {
            base: "NJ",
            letters: /[\u01CA]/g
        },
        {
            base: "Nj",
            letters: /[\u01CB]/g
        },
        {
            base: "O",
            letters: /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g
        },
        {
            base: "OI",
            letters: /[\u01A2]/g
        },
        {
            base: "OO",
            letters: /[\uA74E]/g
        },
        {
            base: "OU",
            letters: /[\u0222]/g
        },
        {
            base: "P",
            letters: /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g
        },
        {
            base: "Q",
            letters: /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g
        },
        {
            base: "R",
            letters: /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g
        },
        {
            base: "S",
            letters: /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g
        },
        {
            base: "T",
            letters: /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g
        },
        {
            base: "TZ",
            letters: /[\uA728]/g
        },
        {
            base: "U",
            letters: /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g
        },
        {
            base: "V",
            letters: /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g
        },
        {
            base: "VY",
            letters: /[\uA760]/g
        },
        {
            base: "W",
            letters: /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g
        },
        {
            base: "X",
            letters: /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g
        },
        {
            base: "Y",
            letters: /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g
        },
        {
            base: "Z",
            letters: /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g
        },
        {
            base: "a",
            letters: /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g
        },
        {
            base: "aa",
            letters: /[\uA733]/g
        },
        {
            base: "ae",
            letters: /[\u00E6\u01FD\u01E3]/g
        },
        {
            base: "ao",
            letters: /[\uA735]/g
        },
        {
            base: "au",
            letters: /[\uA737]/g
        },
        {
            base: "av",
            letters: /[\uA739\uA73B]/g
        },
        {
            base: "ay",
            letters: /[\uA73D]/g
        },
        {
            base: "b",
            letters: /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g
        },
        {
            base: "c",
            letters: /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g
        },
        {
            base: "d",
            letters: /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g
        },
        {
            base: "dz",
            letters: /[\u01F3\u01C6]/g
        },
        {
            base: "e",
            letters: /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g
        },
        {
            base: "f",
            letters: /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g
        },
        {
            base: "g",
            letters: /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g
        },
        {
            base: "h",
            letters: /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g
        },
        {
            base: "hv",
            letters: /[\u0195]/g
        },
        {
            base: "i",
            letters: /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g
        },
        {
            base: "j",
            letters: /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g
        },
        {
            base: "k",
            letters: /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g
        },
        {
            base: "l",
            letters: /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g
        },
        {
            base: "lj",
            letters: /[\u01C9]/g
        },
        {
            base: "m",
            letters: /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g
        },
        {
            base: "n",
            letters: /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g
        },
        {
            base: "nj",
            letters: /[\u01CC]/g
        },
        {
            base: "o",
            letters: /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g
        },
        {
            base: "oi",
            letters: /[\u01A3]/g
        },
        {
            base: "ou",
            letters: /[\u0223]/g
        },
        {
            base: "oo",
            letters: /[\uA74F]/g
        },
        {
            base: "p",
            letters: /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g
        },
        {
            base: "q",
            letters: /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g
        },
        {
            base: "r",
            letters: /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g
        },
        {
            base: "s",
            letters: /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g
        },
        {
            base: "t",
            letters: /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g
        },
        {
            base: "tz",
            letters: /[\uA729]/g
        },
        {
            base: "u",
            letters: /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g
        },
        {
            base: "v",
            letters: /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g
        },
        {
            base: "vy",
            letters: /[\uA761]/g
        },
        {
            base: "w",
            letters: /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g
        },
        {
            base: "x",
            letters: /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g
        },
        {
            base: "y",
            letters: /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g
        },
        {
            base: "z",
            letters: /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g
        }], n = 0; n < t.length; n++) e = e.replace(t[n].letters, t[n].base);
    return e = encodeURIComponent(e)
}
function Client(e, t) {
    var e = e,
        n = null,
        t = t,
        i = [];
    this.getAPIKey = function() {
        return e
    },
        this.getListeners = function() {
            return i
        },
        this.setWebSocket = function(e) {
            this.webSocket = e
        },
        this.getWebSocket = function() {
            return n
        },
        this.getEndpoint = function() {
            return t
        }
}
function fullscreenArea(e, t) {
    1 == e ? t ? (fullscreenArea(2, !1), $("#news-network-area").css({
        visibility: "hidden"
    }), $("#location-and-concepts-column").css({
        visibility: "hidden"
    }), $("#timeline-area").css({
        visibility: "hidden"
    }), $("#entity-details-area").animate({
            width: "100%",
            height: "100%"
        },
        750,
        function() {
            $("#entity-details-area").css({
                width: "100%"
            }),
                $("#entity-details-area").css({
                    height: "100%"
                }),
                $("#expand-details").css({
                    display: "none"
                }),
                $("#collapse-details").css({
                    display: "inline"
                })
        })) : ($("#news-network-area").css({
        visibility: "visible"
    }), $("#location-and-concepts-column").css({
        visibility: "visible"
    }), $("#timeline-area").css({
        visibility: "visible"
    }), $("#entity-details-area").animate({
            width: "25%",
            height: "76%"
        },
        750,
        function() {
            $("#entity-details-area").css({
                width: "25%"
            }),
                $("#entity-details-area").css({
                    height: "76%"
                }),
                $("#expand-details").css({
                    display: "inline"
                }),
                $("#collapse-details").css({
                    display: "none"
                })
        })) : 2 == e && (t ? (showLocationList(!0), $("#locations-view-map").prop("checked", !1), $("#locations-view-list").prop("checked", !0), $("#organization").text("Orgs"), $("#location-and-concepts-column").css({
        width: "29.8%"
    }), $("#location-and-concepts-column").animate({
            width: "20%"
        },
        {
            duration: 500,
            queue: !1
        }), $("#entity-details-area").animate({
            width: "15%"
        },
        {
            duration: 500,
            queue: !1
        }), $("#location-globe").animate({
            width: "100%",
            height: "auto"
        },
        {
            duration: 500,
            queue: !1
        }), $("#concept-cloud").animate({
            width: "100%",
            height: "100%"
        },
        {
            duration: 500,
            queue: !1
        }), $("#news-network-area").animate({
            width: "65%"
        },
        {
            duration: 500,
            queue: !1
        }), $("#news-network-graph svg").animate({
            width: "100%",
            height: "100%"
        },
        500,
        function() {
            $("#location-and-concepts-column").css({
                width: "20%"
            }),
                $("#entity-details-area").css({
                    width: "15%"
                }),
                $("#news-network-area").css({
                    width: "65%"
                }),
                $("#expand-network").css({
                    display: "none"
                }),
                $("#collapse-network").css({
                    display: "inline"
                }),
                network.resize(),
                world_map.resize(),
                cloud.resize()
        })) : ($("#locations-view-map").prop("checked", !0), $("#locations-view-list").prop("checked", !1), $("#organization").text("Organizations"), $("#location-and-concepts-column").css({
        width: "19.8%"
    }), $("#location-and-concepts-column").animate({
            width: "30%"
        },
        {
            duration: 500,
            queue: !1
        }), $("#entity-details-area").animate({
            width: "25%"
        },
        {
            duration: 500,
            queue: !1
        }), $("#location-globe").animate({
            width: "100%",
            height: "auto"
        },
        {
            duration: 500,
            queue: !1
        }), $("#concept-cloud").animate({
            width: "100%",
            height: "100%"
        },
        {
            duration: 500,
            queue: !1
        }), $("#news-network-area").animate({
            width: "45%"
        },
        {
            duration: 500,
            queue: !1
        }), $("#news-network-graph svg").animate({
            width: "100%",
            height: "100%"
        },
        500,
        function() {
            $("#location-and-concepts-column").css({
                width: "30%"
            }),
                $("#entity-details-area").css({
                    width: "25%"
                }),
                $("#news-network-area").css({
                    width: "45%"
                }),
                $("#expand-network").css({
                    display: "inline"
                }),
                $("#collapse-network").css({
                    display: "none"
                }),
                network.resize(),
                world_map.resize(),
                cloud.resize(),
                showLocationList(!1)
        })))
}
function viewTutorial(e) {
    e ? ($("#tutorial-area").css({
        display: "inline"
    }), $("#video-container").append(video), $("#tutorial-nav").empty(), $("#tutorial-nav").append('<img id="tutorial-button" src="images/ui/tutorial_selected.png" />'), $("#tutorial-nav").css({
        cursor: "auto"
    })) : ($(video).detach(), $("#tutorial-area").css({
        display: "none"
    }), $("#tutorial-nav").empty(), $("#tutorial-nav").append('<a onclick="viewTutorial(true)"><img id="tutorial-button" src="images/ui/tutorial.png" /></a>'), $("#tutorial-nav").css({
        cursor: "pointer"
    }))
}
function showSettingsArea(e) {
    showingSettingsArea != e && (showingSettingsArea = e, e ? ($("#category-select").css("visibility", "hidden"), $("#search-field").attr("placeholder", "first subject"), ("Current Events" == $("#search-field").val() || "Art and Entertainment" == $("#search-field").val() || "Business and Industrial" == $("#search-field").val() || "Education" == $("#search-field").val() || "Finance" == $("#search-field").val() || "Health and Fitness" == $("#search-field").val() || "Law, Government and Politics" == $("#search-field").val() || "Religion and Spirituality" == $("#search-field").val() || "Religion and Spirituality" == $("#search-field").val() || "Science" == $("#search-field").val() || "Sports" == $("#search-field").val()) && ($("#search-field").val(""), $('select[name^="selected-entity-type"] option:selected').attr("selected", null), $('select[name^="selected-entity-type"] option[value="unconstrained"]').attr("selected", "selected")), $("#settings-area").css("visibility", "visible"), $("#settings-area").css("top", $("header").height() + "px"), $("#target-field").val(""), $('select[name^="target-entity-type"] option:selected').attr("selected", null), $('select[name^="target-entity-type"] option[value="unconstrained"]').attr("selected", "selected"), $("#target-entity-type").css("color", "#666666"), $("#settings-area").hide().slideDown(200).fadeIn(200), $("#visualizations-area").animate({
            "margin-top": "42px"
        },
        {
            duration: 200,
            queue: !0
        }), $("#timeline-area").css("height", "12%"), timeline.resize(), $("#settings-nav").html("<a onclick='showSettingsArea(false)'>advanced [ - ]</a>"), $("#target-entity-type").css("color", "#666666"), $("#target-entity-type").change(function() {
        "unconstrained" == $("#target-entity-type").val() ? $("#target-entity-type").css("color", "#666666") : "person" == $("#target-entity-type").val() ? $("#target-entity-type").css("color", "#82D1F5") : "company" == $("#target-entity-type").val() ? $("#target-entity-type").css("color", "#00648D") : "organization" == $("#target-entity-type").val() ? $("#target-entity-type").css("color", "#00B0DA") : "location" == $("#target-entity-type").val() && $("#target-entity-type").css("color", "#8CC63F")
    }), $("#show-context").on("click",
        function(e) {
            network.showContextNodes(this.checked)
        }), $("#target-field").keypress(function(e) {
        13 == e.keyCode && (e.preventDefault(), $("#search-button").click(), viewTutorial(!1))
    })) : ($("#category-select").css("visibility", "visible"), $("#category-select").css("display", "none"), $("#search-field").attr("placeholder", "a subject"), $("#settings-area").slideUp(200).fadeOut(200), $("#settings-area").css("visibility", "hidden"), $("#visualizations-area").animate({
            "margin-top": "0px"
        },
        {
            duration: 200,
            queue: !0
        }), $("#timeline-area").css("height", "25%"), timeline.resize(), $("#settings-nav").html("<a onclick='showSettingsArea(true)'>advanced [ + ]</a>"), $("#target-field").val("")), 2 != landingAreaNumSet && (displayCategory(!1), displayTargetCategory(!1)))
}
function setSubjectEnityTypeDropdownColor(e) {
    "company" == e ? $("#selected-entity-type").css("color", "#00648D") : "organization" == e ? $("#selected-entity-type").css("color", "#00B0DA") : "person" == e ? $("#selected-entity-type").css("color", "#82D1F5") : "unconstrained" == e && $("#selected-entity-type").css("color", "#666666")
}
function setTargetEnityTypeDropdownColor(e) {
    "company" == e ? $("#target-entity-type").css("color", "#00648D") : "organization" == e ? $("#target-entity-type").css("color", "#00B0DA") : "person" == e ? $("#target-entity-type").css("color", "#82D1F5") : "unconstrained" == e && $("#target-entity-type").css("color", "#666666")
}
function loadDataFromInvestigate() {
    showSettingsArea(!1);
    var e = $("#search-field").val(),
        t = $("#selected-entity-type").val();
    pushState(e, t),
        loadData(7, !0),
        rewriteTweet()
}
function rewriteTweet() {
    var e, t, n, i = $("#search-field").val();
    if ($("#landing-area").is(":visible") || $("#tutorial-area").is(":visible") || void 0 == i) e = "News Explorer is a cognitive application for understanding current events",
        n = "http://news-explorer.mybluemix.net/";
    else {

        n = encodeURIComponent(document.URL);
        var a = $("#settings-area").is(":visible") && void 0 != $("#target-field").val() && $("#target-field").val().length > 0;
        if (a) {
            var o = $("#target-field").val(),
                r = i + " and " + o;
            i = r
        }
        e = "" == i ? "News Explorer is a cognitive application for understanding current events": "News Explorer visualization for " + i
    }
    e = e.replace(/\s/g, "%20"),
        t = "https://twitter.com/intent/tweet?text=" + e + " " + n,
        $(".twitter-share-button").attr("href", t)
}
function showWatsonLoadIndicator(e) {
    e ? $("#watson-logo-container").show() : $("#watson-logo-container").hide()
}
function showHideWatsonLoadIndicatorQuickly() {
    $("#watson-logo-container").show(),
        setTimeout(function() {
                $("#watson-logo-container").hide()
            },
            5e3)
}
function viewFindMenu(e) {
    e ? ($("#find-icon-details").css({
        display: "none"
    }), $("#hide-find-icon-details").css({
        display: "inline"
    }), $("#find-field").css({
        display: "inline"
    }), $("#find-field").focus()) : ($("#find-icon-details").css({
        display: "inline"
    }), $("#hide-find-icon-details").css({
        display: "none"
    }), $("#find-field").css({
        display: "none"
    }))
}
function displayCategory(e) {
    e ? ($("#search-field").css("background-color", "RGBA(0,0,0,0.0)"), $("#search-field").css("color", "#FDD600"), $("#search-field").css("width", "22vw"), $("#as").css("display", "none"), $('select[name^="selected-entity-type"] option:selected').attr("selected", null), $('select[name^="selected-entity-type"] option[value="unconstrained"]').attr("selected", "selected"), $("#selected-entity-type").css("display", "none"), $("#selected-entity-type").css("color", "#666666")) : ($("#search-field").css("background-color", "#FFFFFF"), $("#search-field").css("color", "#666666"), $("#search-field").css("width", "11vw"), $("#as").css("display", "inline"), $("#selected-entity-type").css("display", "inline"))
}
function displayTargetCategory(e) {
    e ? ($("#target-field").css("background-color", "RGBA(0,0,0,0.0)"), $("#target-field").css("color", "#FDD600"), $("#target-field").css("width", "22vw"), $("#as-target").css("display", "none"), $('select[name^="target-entity-type"] option:selected').attr("selected", null), $('select[name^="target-entity-type"] option[value="unconstrained"]').attr("selected", "selected"), $("#target-entity-type").css("display", "none"), $("#target-entity-type").css("color", "#666666"), $("#show-context").hide(), $("#show-context-label").hide()) : ($("#target-field").css("background-color", "#FFFFFF"), $("#target-field").css("color", "#666666"), $("#target-field").css("width", "11vw"), $("#as-target").css("display", "inline"), $("#target-entity-type").css("display", "inline"), $("#show-context").show(), $("#show-context-label").show())
}
function resetInvestigateFields() {
    $("#search-field").val(""),
        $('select[name^="selected-entity-type"] option:selected').attr("selected", null),
        $('select[name^="selected-entity-type"] option[value="unconstrained"]').attr("selected", "selected"),
        $("#selected-entity-type").css("color", "#666666"),
        $("#target-field").val(""),
        $('select[name^="target-entity-type"] option:selected').attr("selected", null),
        $('select[name^="target-entity-type"] option[value="unconstrained"]').attr("selected", "selected"),
        $("#target-entity-type").css("color", "#666666")
}
function categoryRecognized(e, t) {
    return "unconstrained" != t && null != t && 0 != t.length ? !1 : "Current Events" == e || "Art and Entertainment" == e || "Business and Industrial" == e || "Education" == e || "Finance" == e || "Health and Fitness" == e || "Law, Government and Politics" == e || "Religion and Spirituality" == e || "Technology and Computing" == e || "Science" == e || "Sports" == e ? !0 : void 0
}
function scrollLanding(e) {
    var t = null;
    "right" == e ? (landingAreaNumSet = 2, null != pr_params && (t = "&" + pr_params), $("#landing-sub-area-one-icon-active").css({
        display: "none"
    }), $("#landing-sub-area-one-icon-inactive").css({
        display: "inline"
    }), $("#landing-sub-area-two-icon-active").css({
        display: "inline"
    }), $("#landing-sub-area-two-icon-inactive").css({
        display: "none"
    }), $("#landing-sub-area-two").css({
        visibility: "visible"
    }).hide().fadeIn(1e3), refreshRiverStats(), $("html, body").animate({
            scrollLeft: .5 * $("#landing-area").width()
        },
        500,
        function() {
            pr_startPantaRhei(),
                $("#landing-nav-right").css({
                    visibility: "hidden"
                }),
                $("#landing-nav-left").css({
                    visibility: "visible"
                }).hide().fadeIn(1e3),
                $("#landing-sub-area-one").css({
                    visibility: "hidden"
                }),
                $("#river-stats").css({
                    visibility: "visible"
                })
        })) : "left" == e && (landingAreaNumSet = 1, $("#landing-sub-area-one-icon-active").css({
        display: "inline"
    }), $("#landing-sub-area-one-icon-inactive").css({
        display: "none"
    }), $("#landing-sub-area-two-icon-active").css({
        display: "none"
    }), $("#landing-sub-area-two-icon-inactive").css({
        display: "inline"
    }), $("#landing-sub-area-one").css({
        visibility: "visible"
    }).hide().fadeIn(1e3), $("#landing-sub-area-two").fadeOut(500), $("#river-stats").css({
        visibility: "hidden"
    }), $("html, body").animate({
            scrollLeft: "0"
        },
        500,
        function() {
            prepareLandingAreaOne(),
                pr_pausePantaRhei(),
                $("#landing-nav-right").css({
                    visibility: "visible"
                }).hide().fadeIn(1e3),
                $("#landing-nav-left").css({
                    visibility: "hidden"
                })
        }));
    var n = document.location.origin + "/?view=" + landingAreaNumSet;
    null != t && (n += t);//,
    //window.history.pushState({},
    //"", n)
}
function viewLanding(e) {
    if (pr_pausePantaRhei(), landingAreaVisible = e, e) {
        if ($("header").css({
                position: "fixed"
            }), $("#landing-area").css({
                display: "inline"
            }), $("#find-panel").css({
                display: "none"
            }), $("#find").css({
                display: "none"
            }), $("#prompt").css("visibility", "hidden"), $("#landing-nav").empty(), $("#landing-nav").append('<img id="home" src="images/ui/home_selected.png" />'), $("#landing-nav").css({
                cursor: "auto"
            }), $("body").append('<div id="river-stats"></div>'), showLocationList(!1), resetLocationRadioButtons(), 1 == landingAreaNumSet) $("#landing-sub-area-two").css({
            visibility: "visible"
        }).hide().fadeIn(1e3),
            $("#landing-sub-area-one").css({
                visibility: "hidden"
            }),
            $("html, body").scrollLeft(1),
            scrollLanding('right'),
            //pr_startPantaRhei(),
            //refreshRiverStats(),
            //prepareLandingAreaOne(),
            $("#landing-nav-right").css({
                visibility: "visible"
            }).hide().fadeIn(1e3),
            $("#landing-nav-left").css({
                visibility: "hidden"
            }),
            $("#landing-sub-area-one-icon-active").css({
                display: "inline"
            }),
            $("#landing-sub-area-one-icon-inactive").css({
                display: "none"
            }),
            $("#landing-sub-area-two-icon-active").css({
                display: "none"
            }),
            $("#landing-sub-area-two-icon-inactive").css({
                display: "inline"
            }),
            $("#river-stats").css({
                visibility: "hidden"
            });
        else if (2 == landingAreaNumSet) {
            $("#landing-sub-area-two").css({
                visibility: "visible"
            }).hide().fadeIn(1e3),
                $("#landing-sub-area-one").css({
                    visibility: "hidden"
                });
            var t = .5 * $("#landing-area").width();
            $("html, body").scrollLeft(t),
                $("#landing-nav-right").css({
                    visibility: "hidden"
                }),
                $("#landing-nav-left").css({
                    visibility: "visible"
                }).hide().fadeIn(1e3),
                $("#landing-sub-area-one-icon-active").css({
                    display: "none"
                }),
                $("#landing-sub-area-one-icon-inactive").css({
                    display: "inline"
                }),
                $("#landing-sub-area-two-icon-active").css({
                    display: "inline"
                }),
                $("#landing-sub-area-two-icon-inactive").css({
                    display: "none"
                }),
                pr_startPantaRhei(),
                refreshRiverStats(),
                $("#river-stats").css({
                    visibility: "visible"
                })
        }
    } else 2 == landingAreaNumSet && pr_pausePantaRhei(),
        $("html,body").scrollLeft(0),
        $("header").css({
            position: "relative"
        }),
        $("#landing-area").css({
            display: "none"
        }),
        $("#find-panel").css({
            display: "inline"
        }),
        $("#find").css({
            display: "inline"
        }),
        $("#landing-nav").empty(),
        $("#landing-nav").append('<a onclick="goHome()"><img id="home" src="images/ui/home_unselected.png" /></a>'),
        $("#landing-nav").css({
            cursor: "pointer"
        }),
        $("#powered-by-watson").remove(),
        $("#river-stats").remove();
    rewriteTweet()
}
//左下角的文字
function refreshRiverStats() {
    var e = null;
    if (null != pr_newsData && (e = pr_newsData.nodes), null != e) {
        for (var t = [], n = 0, i = 0; i < e.length; i++)"article" == e[i].type && (n++, t.push(e[i]));
        t.sort(function(e, t) {
            return e = new Date(e.date),
                t = new Date(t.date),
                t > e ? -1 : e > t ? 1 : 0
        });
        var a, o = new Date(t[0].date),
            r = new Date(t[t.length - 1].date),
            s = r - o,
            l = Math.floor(s / dayInMillis),
            c = Math.floor((s - l * dayInMillis) / hourInMillis),
            u = Math.floor((s - (l * dayInMillis + c * hourInMillis)) / minuteInMillis);
        a = "1" == l ? " day, ": " days, ";
        var d;
        d = "1" == l ? " hour, ": " hours, ";
        var p;
        p = "0" == l ? "0" == c ? u + " min": c + d + u + " min": l + a + c + d + u + " min";
        var h = n + " articles across " + p;
        //左下角的文字
        $("#river-stats").text(h)
    }
}
function goHome() {
    var e = document.location.origin + "/?view=" + landingAreaNumSet;
    if (2 == landingAreaNumSet) {
        pr_clearScreen(),
            pr_spinner();
        var t = $("#search-field").val(),
            n = $("#selected-entity-type").val();
        null != t && t.length > 0 && (e += "&query=" + t, null != n && n.length > 0 && (e += "&type=" + n));
        var i = $("#target-field").val(),
            a = $("#target-entity-type").val();
        null != i && i.length > 0 && (categoryRecognized(i, null) ? e += "&category=" + i: (e += "&target=" + i, null != a && a.length > 0 && (e += "&targetType=" + a))),
            viewLanding(!0),
            window.history.pushState({},
                "", e),
            pr_data(lastQueryResults)
    } else viewLanding(!0),
        window.history.pushState({},
            "", e)
}
function showLandingAreaDescription(e) {
    e != currentDescription && ($("#landing-sub-area-info-container").empty(), $("#landing-sub-area-info-container").append(e), $("#landing-sub-area-info-container").fadeIn(500)),
        currentDescription = e
}
function hideLandingAreaDescription(e) {
    null != descriptionTimer && (clearTimeout(descriptionTimer), descriptionTimer = null),
        null == e ? $("#landing-sub-area-info-container").css("opacity") > 0 && $("#landing-sub-area-info-container").fadeOut(500) : descriptionTimer = setTimeout(function() {
                hideLandingAreaDescription()
            },
            e),
        currentDescription = null
}
function pr_backfillTick(e, t, n, i, a, o) {
    if (console.log("Backfill received: " + e), pr_checkTick(e) && o == pr_toggleCount && (pr_shoreBeachLine(i), pr_cleanBeachLine(30), pr_killTick(e))) {
        // console.log("Backfill executing: " + e);
        for (var r = pr_getBeachSpan(n), s = r.y1 - r.y0, l = pr_fontSizeByHeight(s), c = r.y0, u = pr_fontMap[0].fontHeight, d = pr_getStreamNum(r.y0), p = 0; c + u < r.y1;) {
            var h, g = pr_titleCounters[d];
            h = pr_fontHeightBySize(pr_titles[g].size) <= r.y1 - c ? pr_titles[g].size: Math.floor(Math.random() * (l - pr_minFontSize)) + pr_minFontSize;
            var y, f = pr_fontHeightBySize(h),
                m = f;
            if (f < r.y1 - c) {
                var v = pr_xBuffer;
                p > 0 && (v = Math.floor(Math.random() * (100 - pr_xBuffer)) + pr_xBuffer),
                    y = pr_createNewTick(c, t, h, g, v),
                    a ? pr_armNewTick(y) : (y.animate("opacity", 0, 0), pr_showNewTick(y)),
                    m = parseInt(y.attr("pr_tickHeight")),
                    pr_updateCounters(d),
                    p++
            }
            c += m
        }
    }
}
//去掉title
function pr_createNewTick(e, t, n, i, a) {
    var o = "tick-" + pr_tickCounter,
        r = $("<div/>").attr("id", o);
    r.attr("class", "measure"),
      //  r.attr("title", pr_titles[i].title),
      //   r.html(pr_titles[i].title),
        pr_titles[i].link!=null&&pr_titles[i].link.length>0?
            r.html("<span onclick=\"window.open('"+pr_titles[i].link+"')\">"+pr_titles[i].title+"</span>")
            :r.html(pr_titles[i].title),

        r.css("font-size", n),
        r.css("font-family", pr_fontFamily),
        r.css("color", pr_fontColors[pr_titles[i].color]),
        r.css("white-space", "nowrap"),
        r.css("cursor", "pointer"),
        $("body").append(r),
        bbox = r[0].getBoundingClientRect(),
        tickWidth = bbox.width + a,
        tickHeight = Math.ceil(bbox.height + pr_yBuffer),
        r.attr("pr_tickWidth", tickWidth),
        r.attr("pr_tickHeight", tickHeight),
        r.attr("pr_tickTop", e),
        r.attr("pr_tickOffset", a),
        r.remove(),
        r.attr("class", "tickle"),
        r.css({
            top: e,
            left: t + a,
            position: "absolute"
        }),
        r.click(function() {

        }),
        $("#ticker").append(r);
    var s = pr_updateBeachLine(e, tickWidth, tickHeight, o);
    return r.attr("pr_shoreLine", s),
        r
}
function pr_armNewTick(e) {
    var t = e.attr("id"),
        n = parseInt(e.attr("pr_tickWidth")),
        i = (parseInt(e.attr("pr_tickHeight")), parseInt(e.attr("pr_tickTop"))),
        a = parseInt(e.attr("pr_shoreLine")),
        o = (pr_tickerWidth + n) / pr_scanSpeed;

    e.animate({
            left: -n
        },
        o, "linear",
        function() {
            $(this).click(null),
                $(this).remove()
        }),
        pr_activeTicks.push(t);
    var r = n / pr_scanSpeed,
        s = pr_toggleCount;
    setTimeout(function() {
            pr_backfillTick(t, pr_tickerWidth, i, a, !0, s)
        },
        r)
}
function pr_showNewTick(e) {
    e.animate({
            opacity: 1
        },
        1e3, "linear")
}
function pr_fontHeightBySize(e) {
    for (var t = 0; t < pr_fontMap.length; t++) if (pr_fontMap[t].fontSize == e) return pr_fontMap[t].fontHeight;
    return 0
}
function pr_fontSizeByHeight(e) {
    for (var t = 0; t < pr_fontMap.length; t++) if (pr_fontMap[t].fontHeight >= e) return 0 == t ? pr_fontMap[0].fontSize: pr_fontMap[t - 1].fontSize;
    return pr_maxFontSize
}
function pr_getBeachSpan(e) {
    for (var t = {
            y0: pr_tickerTop,
            y1: pr_tickerTop
        },
             n = -1, i = 0; i < beachLine.length; i++) {
        if (beachLine[i].y == e) {
            t.y0 = beachLine[i].y,
                n = i,
                t.y1 = i < beachLine.length - 1 ? beachLine[i + 1].y: pr_tickerBottom;
            break
        }
        if (beachLine[i].y > e) {
            i > 0 ? (t.y0 = beachLine[i - 1].y, n = i - 1) : (t.y0 = pr_tickerTop, n = 0),
                t.y1 = beachLine[i].y;
            break
        }
    }
    return - 1 == n && (t.y0 = beachLine[beachLine.length - 1].y, t.y1 = pr_tickerBottom, n = beachLine.length - 1),
        "split" == beachLine[n].id ? {
            y0: pr_tickerTop,
            y1: pr_tickerTop
        }: t
}
function pr_getStreamNum(e) {
    return 1 == pr_numStreams ? 0 : pr_screenSplit > e ? 0 : 1
}
function pr_getNextTitle(e) {
    var t = pr_titleCounters[e],
        n = pr_titleCounters[e];
    if (n++, n >= pr_titles.length && (0 == e && pr_loopCounter++, n = 0), 1 == pr_numStreams) return n;
    for (; n != t;) {
        if (0 == e) {
            if (0 == pr_titles[n].stream) return n
        } else if (0 != pr_titles[n].stream) return n;
        n++,
        n >= pr_titles.length && (0 == e && pr_loopCounter++, n = 0)
    }
    return t
}
function pr_updateCounters(e) {
    pr_titleCounters[e] = pr_getNextTitle(e),
        pr_tickCounter > 1e5 ? pr_tickCounter = 0 : pr_tickCounter++
}
function pr_checkTick(e) {
    if (!e) return ! 1;
    if ("overRide" == e) return ! 0;
    var t = pr_activeTicks.indexOf(e);
    return - 1 != t ? !0 : !1
}
function pr_killTick(e) {
    if (!e) return ! 1;
    if ("overRide" == e) return ! 0;
    var t = pr_activeTicks.indexOf(e);
    return - 1 != t ? (pr_activeTicks.splice(t, 1), !0) : !1
}
function pr_updateBeachLine(e, t, n, i) {
    for (var a, o, r = !1,
             s = 0; s < beachLine.length; s++) {
        if (beachLine[s].y == e) return a = beachLine[s].x,
            o = beachLine[s].id,
            pr_killTick(o),
            beachLine[s].x = a + t,
            beachLine[s].id = i,
            s < beachLine.length - 1 ? beachLine[s + 1].y > e + n && beachLine.splice(s + 1, 0, {
                x: a,
                y: e + n,
                id: o
            }) : pr_tickerBottom > e + n && beachLine.splice(s + 1, 0, {
                x: a,
                y: e + n,
                id: o
            }),
        a + t;
        if (beachLine[s].y > e) return a = beachLine[s - 1].x,
            o = beachLine[s - 1].id,
            pr_killTick(beachLine[s - 1].id),
            beachLine.splice(s, 0, {
                x: a + t,
                y: e,
                id: i
            }),
        s < beachLine.length - 1 && beachLine[s + 1].y > e + n && beachLine.splice(s + 1, 0, {
            x: a,
            y: e + n,
            id: o
        }),
        a + t
    }
    return r ? void 0 : (a = beachLine[beachLine.length - 1].x, o = beachLine[beachLine.length - 1].id, pr_killTick(beachLine[beachLine.length - 1].id), beachLine.splice(beachLine.length, 0, {
        x: a + t,
        y: e,
        id: i
    }), pr_tickerBottom > e + n && beachLine.splice(beachLine.length, 0, {
        x: a,
        y: e + n,
        id: o
    }), a + t)
}
function pr_cleanBeachLine(e) {
    for (var t = 1; t < beachLine.length; t++)"split" != beachLine[t - 1].id && "split" != beachLine[t].id && (beachLine[t].y - beachLine[t - 1].y < pr_fontMap[0].fontHeight || Math.abs(beachLine[t].x - beachLine[t - 1].x) < e) && (beachLine[t].x > beachLine[t - 1].x ? (beachLine[t].y = beachLine[t - 1].y, pr_killTick(beachLine[t - 1].id), beachLine.splice(t - 1, 1), t--) : (pr_killTick(beachLine[t].id), beachLine.splice(t, 1), t--))
}
function pr_shoreBeachLine(e) {
    for (var t = 0; t < beachLine.length; t++)"split" != beachLine[t].id && beachLine[t].x < e && (beachLine[t].x = e - 1)
}
function pr_trimBeachLine() {
    for (var e = Number.MIN_VALUE,
             t = 0; t < beachLine.length; t++) beachLine[t].x > e && (e = beachLine[t].x);
    pr_trimNeeded = e >= Number.MAX_VALUE - 5e5 ? !0 : !1,
    pr_currView && pr_trimNeeded && (console.log("Trimming..."), clearInterval(pr_trimTimer), pr_hardRestart(), pr_trimNeeded = !1, setTimeout(function() {
            pr_setTrimTimer()
        },
        timeoutDuration + 1))
}
function pr_hardRestart() {
    pr_activeTicks = [],
        pr_restoreBeachline();
    var e = 0;
    $(".tickle").each(function() {
        var t = parseInt($(this).css("left"));
        if (t > pr_tickerWidth) $(this).remove();
        else {
            var n = t + $(this)[0].getBoundingClientRect().width;
            if (n > pr_tickerWidth) {
                var i = n - pr_tickerWidth;
                i > e && (e = i)
            }
        }
    });
    var t = (e + pr_xBuffer) / pr_scanSpeed,
        n = pr_toggleCount;
    setTimeout(function() {
            pr_backfillTick("overRide", pr_tickerWidth, pr_tickerTop, 0, !0, n)
        },
        t)
}
function pr_testFontSizes() {
    for (var e = pr_minFontSize; pr_maxFontSize >= e; e++) {
        var t = $("<div/>").attr("class", "measure");
        t.html("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()?"),
            t.css("font-size", e),
            t.css("font-family", pr_fontFamily),
            t.css("color", "#7B7B7B"),
            t.css("white-space", "nowrap"),
            t.css({
                top: 0,
                left: 0
            }),
            $("body").append(t);
        var n = t[0].getBoundingClientRect(),
            i = Math.ceil(n.height + pr_yBuffer);
        pr_fontMap.push({
            fontHeight: i,
            fontSize: e
        }),
            t.remove()
    }
}
function pr_populateTitles(e) {
    if (landingAreaVisible && 2 == landingAreaNumSet) {
        //console.log("Populating titles: " + e);
        var t = restServerURL + "/api/news?",
            n = getParameters();
        if (null != n.query) {
            var i = decodeURIComponent(n.query);
            categoryRecognized(i, n.type) ? (t += "category=" + n.query, pr_params = "query=" + n.query) : (pr_params = "query=" + n.query, null != n.type && (pr_params += "&type=" + n.type), null != n.target && (pr_params += "&target=" + n.target, null != n.targetType && (pr_params += "&targetType=" + targetType)), null != n.category && (pr_params += "&category=" + n.category), t += pr_params)
        } else pr_params = "query=Current%20Events",
            t += "category=Current%20Events";
        pr_initView = e,
            load()
    }
}
function pr_data(e) {
    if ($(".spinner").css({
            visibility: "hidden"
        }), "OK" == e.status && e.nodes.length > 0) {
        var t = getParameters();
        if (null != t.query) {
            {
                decodeURIComponent(t.query)
            }
            pr_params = "query=" + t.query,
            null != t.type && (pr_params += "&type=" + t.type),
            null != t.target && (pr_params += "&target=" + t.target, null != t.targetType && (pr_params += "&targetType=" + t.targetType)),
            null != t.category && (pr_params += "&category=" + t.category)
        } else pr_params = "query=Current%20Events"
    }
    var n, i = [],
        a = [],
        o = [];
    pr_newsData = e;
    var r = e.nodes;

    pr_numStreams = e.numStreams;
    for (var s = 0; s < r.length; s++)
        "article" == r[s].type && (n = {},
            n.link = r[s].source, n.title = r[s].name,  n.stream = r[s].stream, n.sentiment = r[s].sentiment, a.splice(locationOf(r[s].sentiment, a) + 1, 0, r[s].sentiment), n.prominence = r[s].prominence, i.splice(locationOf(r[s].prominence, i) + 1, 0, r[s].prominence), o.push(n));
    for (var l = a.length / pr_fontColors.length,
             c = i.length / (pr_maxFontSize - pr_minFontSize), s = 0; s < o.length; s++) {
        for (var u = 1; u <= pr_fontColors.length; u++) {
            var d = Math.min(a.length - 1, Math.ceil(l * u));
            if (o[s].sentiment <= a[d]) {
                o[s].color = u - 1;
                break
            }
        }
        for (var u = 1; pr_maxFontSize - pr_minFontSize >= u; u++) {
            var d = Math.min(i.length - 1, Math.ceil(c * u));
            if (o[s].prominence <= i[d]) {
                o[s].size = pr_minFontSize + u;
                break
            }
        }
    }
    pr_tickCounter = 0,
        pr_loopCounter = 0,
        pr_titleCounters = [0, 0],
    0 != o.length && (pr_titles = o, pr_numStreams > 1 && (0 == pr_titles[0].stream ? pr_titleCounters[1] = pr_getNextTitle(1) : pr_titleCounters[0] = pr_getNextTitle(0)), pr_initView && (pr_activeTicks = [], $(".tickle").remove(), pr_toggleCount++, pr_fillScreen()), refreshRiverStats())
}
function pr_clearScreen() {
    pr_activeTicks = [],
        $(".tickle").remove(),
        pr_toggleCount++,
        pr_initView = !0
}
function locationOf(e, t, n, i) {
    n = n || 0,
        i = i || t.length;
    var a = parseInt(n + (i - n) / 2, 10);
    return 1 >= i - n ? t[a] < e ? a: a - 1 : t[a] === e ? a: t[a] < e ? locationOf(e, t, a, i) : locationOf(e, t, n, a)
}
function pr_printBeachLine() {
    for (var e = 0; e < beachLine.length; e++) console.log("id: " + beachLine[e].id + "   x: " + beachLine[e].x + "   y: " + beachLine[e].y)
}
function pr_setTickerDimensions() {
    console.log("Sizing Ticker...");
    var e = pr_tickerWidth,
        t = pr_tickerHeight;
    if (pr_tickerWidth = $("#ticker").width(), pr_tickerHeight = $("#ticker").height(), pr_tickerWidth > 2e3 ? (pr_minFontSize = 20, pr_maxFontSize = 70) : (pr_minFontSize = 14, pr_maxFontSize = 60), pr_tickerTop = pr_padding, pr_tickerBottom = pr_tickerHeight - pr_padding, pr_tickerWidth != e || pr_tickerHeight != t) {
        if (!pr_currView) return pr_activeTicks = [],
            $(".tickle").remove(),
            void pr_fillScreen();
        if (null != beachLine) {
            if (pr_tickerHeight > t) {
                pr_splitBeachline();
                for (var n = beachLine.length - 1; ! beachLine[n].id || -1 == pr_activeTicks.indexOf(beachLine[n].id);) n--;
                var i = $("#" + beachLine[n].id),
                    a = parseInt(i.css("left")) + i[0].getBoundingClientRect().width - pr_tickerWidth,
                    o = beachLine[n].x - a;
                beachLine.push({
                    y: t,
                    x: o,
                    id: null
                });
                var r = pr_toggleCount;
                pr_backfillTick("overRide", pr_tickerWidth, t, 0, !0, r)
            } else if (t > pr_tickerHeight) {
                pr_splitBeachline();
                for (var s = !1,
                         l = 0; l < beachLine.length - 1; l++) if (beachLine[l + 1].y > pr_tickerBottom) {
                    s = !0,
                        pr_killTick(beachLine[l].id);
                    var c = $("#" + beachLine[l].id);
                    c && c.remove(),
                        beachLine.splice(l, 1),
                        l--
                }
                if (s) {
                    pr_killTick(beachLine[beachLine.length - 1].id);
                    var c = $("#" + beachLine[beachLine.length - 1].id);
                    c && c.remove(),
                        beachLine.splice(beachLine.length - 1, 1)
                }
            }
            e > pr_tickerWidth && pr_hardRestart()
        }
    }
}
function pr_fillScreen() {
    pr_restoreBeachline();
    for (var e, t, n = !1,
             i = pr_toggleCount,
             a = [], o = 0; o < beachLine.length; o++) if ("split" != beachLine[o].id) {
        var r = {};
        r.x = beachLine[o].x,
            r.y = beachLine[o].y,
            a.push(r)
    }
    for (var o = 0; o < a.length; o++) pr_backfillTick("overRide", a[o].x, a[o].y, 0, !1, i);
    for (; ! n;) {
        t = Number.MAX_VALUE,
            e = -1;
        for (var o = 0; o < beachLine.length; o++) beachLine[o].id && "split" != beachLine[o].id && beachLine[o].x < t && (t = beachLine[o].x, e = o);
        pr_tickerWidth > t ? (beachLine[e].id = null, pr_backfillTick("overRide", beachLine[e].x, beachLine[e].y, beachLine[e].x, !1, i)) : n = !0
    } (pr_currView || pr_launching) && pr_startPantaRhei()
}
function pr_splitBeachline() {
    for (var e = 0; e < beachLine.length; e++)"split" == beachLine[e].id && (beachLine[e].id = null);
    if (1 != pr_numStreams) {
        pr_screenSplit = (pr_tickerBottom - pr_tickerTop) / 2;
        for (var t = 0,
                 e = 1; e < beachLine.length; e++) if (beachLine[e].y > pr_screenSplit - pr_splitSize / 2) {
            t = e - 1;
            break
        }
        for (var e = t + 1; e < beachLine.length; e++) beachLine[e].y < pr_screenSplit + pr_splitSize / 2 && (beachLine.splice(e, 1), e--);
        beachLine.splice(t + 1, 0, {
            y: pr_screenSplit + pr_splitSize / 2,
            x: 0,
            id: null
        }),
            beachLine.splice(t + 1, 0, {
                y: pr_screenSplit - pr_splitSize / 2,
                x: -10,
                id: "split"
            })
    }
}
function pr_restoreBeachline() {
    beachLine = [{
        y: pr_tickerTop,
        x: 0,
        id: null
    }],
        pr_screenSplit = 0,
        pr_splitBeachline()
}
function pr_setTrimTimer() {
    pr_trimTimer = setInterval(pr_trimBeachLine, 1e3 * pr_trimWait)
}
function pr_initialize() {
    pr_activeTicks = [],
        pr_restoreBeachline();
    pr_tickerWidth = $(window).width(),
        pr_tickerHeight = $(window).height() - $("header").height(),
        $("#ticker").css({
            width: pr_tickerWidth + "px"
        }),
        $("#ticker").css({
            height: pr_tickerHeight + "px"
        }),
        pr_setTickerDimensions(),
        pr_testFontSizes(),
        pr_activeTicks = [],
        spinner = (new Spinner).spin(),
        document.getElementById("ticker").appendChild(spinner.el),
        pr_currWeek = Math.floor(Date.now()),
        pr_populateTitles(!0);
    var e;
    window.onresize = function() {
        $("#ticker").css({
            height: $(window).height() - $("header").height() + "px"
        }),
            $("#ticker").css({
                width: $(window).width() + "px"
            }),
            clearTimeout(e),
            e = setTimeout(pr_setTickerDimensions, 100)
    },
        pr_setTrimTimer(),
        setInterval(function() {
                pr_currView && pr_populateTitles(!1)
            },
            18e5)
}
function pr_pausePantaRhei() {
    pr_currView = !1,
        pr_activeTicks = [],
        $(".tickle").stop()
}
function pr_launchPantaRhei() {
    pr_currView = !0,
        pr_launching = !0
}
function pr_startPantaRhei() {
    console.log("pr_startPantaRhei")
    if (null != pr_newsData) {
        pr_launching ? pr_launching = !1 : pr_pausePantaRhei();
        var e = getParameters();
        if (null != e.query) {
            var t = decodeURIComponent(e.query);
            $("#search-field").val(t),
                categoryRecognized(t, e.type) ? displayCategory(!0) : (displayCategory(!1), null != e.type && $("#selected-entity-type").val(e.type))
        } else displayCategory(!0),
            $("#search-field").val("Current Events");
        null != e.target ? (showSettingsArea(!0), displayTargetCategory(!1), $("#target-field").val(decodeURIComponent(e.target)), null != e.targetType && $("#target-entity-type").val(e.targetType)) : null != e.category ? (showSettingsArea(!0), displayTargetCategory(!0), $("#target-field").val(decodeURIComponent(e.category))) : showSettingsArea(!1),
            pr_currView = !0,
            pr_toggleCount++,
            $(".tickle").each(function() {
                var e = parseInt($(this).attr("pr_tickWidth")),
                    t = parseInt($(this).attr("pr_tickTop")),
                    n = $(this).position().left - parseInt($(this).attr("pr_tickOffset")),
                    i = parseInt($(this).attr("pr_shoreLine")),
                    a = $(this).position().left + $(this).width(),
                    o = (n + e) / pr_scanSpeed;
                if ($(this).animate({
                            left: -e
                        },
                        o, "linear",
                        function() {
                            $(this).click(null),
                                $(this).remove()
                        }), pr_showNewTick($(this)), a > pr_tickerWidth) {
                    var r = $(this).attr("id");
                    if (beachLineTick(r)) {
                        pr_activeTicks.push(r);
                        var s = (a - pr_tickerWidth) / pr_scanSpeed,
                            l = pr_toggleCount;
                        setTimeout(function() {
                                pr_backfillTick(r, pr_tickerWidth, t, i, !0, l)
                            },
                            s)
                    }
                }
            })
    }
}
function beachLineTick(e) {
    for (var t = 0; t < beachLine.length; t++) if (null != beachLine[t].id && beachLine[t].id == e) return ! 0;
    return ! 1
}
function pr_spinner() {
    $(".spinner").css({
        visibility: "visible"
    })
}
function prepareLandingAreaOne() {
    displayCategory(!1),
        resetInvestigateFields(),
        showSettingsArea(!1),
        populateTrendingQueries(),
        populateTrendingConnections(),
        populateBreakingNews(),
        determineCategoryURLs(),
        setTimeout(function() {
                $(window).resize()
            },
            3e3)
}
function adjustLanding() {
    $("#trending-queries-panel #title-container #title").css({
        "font-size": .5 * $("#trending-queries-panel #title-container").height() + "px",
        "vertical-align": "middle"
    }),
        $("#trending-queries-panel #sub-panel .trend-cell .trend-text").css({
            "font-size": $("#trending-queries-panel #sub-panel .trend-cell").height() + "px",
            "vertical-align": "top"
        }),
        $("#trending-queries-panel #sub-panel .trend-cell .entity-img").css({
            height: .8 * $("#trending-queries-panel #sub-panel .trend-cell").height() + "px",
            width: "auto"
        }),
        $("#trending-connections-panel #title-container #title").css({
            "font-size": .5 * $("#trending-connections-panel #title-container").height() + "px",
            "vertical-align": "middle"
        }),
        $("#trending-connections-panel #sub-panel .trend-cell .trend-text").css({
            "font-size": $("#trending-connections-panel #sub-panel .trend-cell").height() + "px",
            "vertical-align": "top"
        }),
        $("#trending-connections-panel #sub-panel .trend-cell .entity-img").css({
            height: .8 * $("#trending-connections-panel #sub-panel .trend-cell").height() + "px",
            width: "auto"
        }),
        $("#breaking-news-panel #title-container #title").css({
            "font-size": .35 * $("#breaking-news-panel #title-container").height() + "px",
            "vertical-align": "middle"
        }),
        $("#breaking-news-panel #sub-panel #breaking-headers .breaking-header .category-text").css({
            "font-size": .4 * $("#breaking-news-panel #sub-panel #breaking-headers .breaking-header").height() + "px",
            "vertical-align": "middle",
            "line-height": "100%"
        }),
        $("#breaking-news-panel #sub-panel #breaking-rows .breaking-row .breaking-text").css({
            "vertical-align": "middle",
            "line-height": "50%"
        }),
        $("#breaking-news-panel #sub-panel #breaking-rows").css({
            width: $("#breaking-news-panel #sub-panel").width() - $("#breaking-news-panel #sub-panel #breaking-headers").width() - 2 + "px"
        }),
        onlyRenderBreakingNewsTagsThatFit()
}
function onlyRenderBreakingNewsTagsThatFit() {
    for (var e = $("#breaking-news-panel #sub-panel #breaking-rows .breaking-row").length, t = $("#breaking-news-panel #sub-panel #breaking-rows").width(), n = [], i = 200, a = 1; e >= a; a++) n[a - 1] = 0,
        $("#breaking-news-panel #sub-panel #breaking-rows .breaking-row:nth-child(" + a + ") .breaking-text").each(function() {
            n[a - 1] += $(this).width(),
                $(this).css(n[a - 1] > t - i ? {
                    display: "none"
                }: {
                    display: "inline"
                })
        })
}
function determineCategoryURLs() {
    $("#current-events-header").attr({
        onclick: 'newsQuery("Current Events", "unconstrained")'
    }),
        $("#art-and-entertainment-header").attr({
            onclick: 'newsQuery("Art and Entertainment", "unconstrained")'
        }),
        $("#business-and-industrial-header").attr({
            onclick: 'newsQuery("Business and Industrial", "unconstrained")'
        }),
        $("#education-header").attr({
            onclick: 'newsQuery("Education", "unconstrained")'
        }),
        $("#finance-header").attr({
            onclick: 'newsQuery("Finance", "unconstrained")'
        }),
        $("#health-and-fitness-header").attr({
            onclick: 'newsQuery("Health and Fitness", "unconstrained")'
        }),
        $("#law-government-and-politics-header").attr({
            onclick: 'newsQuery("Law, Government and Politics", "unconstrained")'
        }),
        $("#religion-and-spirituality-header").attr({
            onclick: 'newsQuery("Religion and Spirituality", "unconstrained")'
        }),
        $("#science-header").attr({
            onclick: 'newsQuery("Science", "unconstrained")'
        }),
        $("#sports-header").attr({
            onclick: 'newsQuery("Sports", "unconstrained")'
        }),
        $("#technology-and-computing-header").attr({
            onclick: 'newsQuery("Technology and Computing", "unconstrained")'
        })
}
function placeTrendingCounts() {
    for (var e = $(".trend-cell").length, t = 1; e >= t; t++) $("#trending-queries-panel #sub-panel .trend-cell:nth-child(" + t + ")").append("<span style='float:right; color:#666666'>513 queries</span>")
}
function populateTrendingQueries() {
    $("#trending-queries-panel #sub-panel .trend-path .trend-cell").empty();
    var e = [{
        type: "connection",
        entity1Type: "company",
        entity1: "IBM",
        entity2Type: "person",
        entity2: "Bob Dylan"
    },
        {
            type: "company",
            query: "Apple"
        },
        {
            type: "person",
            query: "Donald Trump"
        },
        {
            type: "connection",
            entity1Type: "organization",
            entity1: "NSA",
            entity2Type: "person",
            entity2: "Edward Snowden"
        },
        {
            type: "organization",
            query: "National Foundation for the Arts"
        },
        {
            type: "person",
            query: "Hillary Clinton"
        },
        {
            type: "company",
            query: "The Walt Disney Company"
        },
        {
            type: "person",
            query: "Barack Obama"
        }];
    if (useRestServer) {
        var t = restServerURL + "/api/trendingQueries/?type=queries";
        $.getJSON(t,
            function(t, n) {
                "success" == n && (e = t.trendingQueries),
                    renderTrends(e)
            })
    } else renderTrends(e)
}
function renderTrends(e) {
    $("#trending-queries-panel #sub-panel .trend-path .trend-cell").empty();
    var t = $("#trending-queries-panel #sub-panel .trend-path .trend-cell").length,
        n = e.length;
    n > t && (n = t);
    for (var i = 1; t >= i; i++) {
        var a = i - 1;
        if ("connection" == e[a].type) {
            var o = e[a].entity1,
                r = e[a].entity1Type,
                s = e[a].entity2,
                l = e[a].entity2Type,
                c = "newsConnectionQuery('" + o + "', '" + r + "', '" + s + "', '" + l + "')";
            // $("#trending-queries-panel #sub-panel .trend-path:nth-child(" + i + ")").attr("onclick", c),
            //     "company" == e[a].entity1Type ? ($("#trending-queries-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<img class="entity-img" src="images/entities/colorized/company_default.png">'), $("#trending-queries-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<div class="company-entity-static trend-text">' + e[a].entity1 + "</div>")) : "organization" == e[a].entity1Type ? ($("#trending-queries-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<img class="entity-img" src="images/entities/colorized/organization_default.png">'), $("#trending-queries-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<div class="organization-entity-static trend-text">' + e[a].entity1 + "</div>")) : "person" == e[a].entity1Type ? ($("#trending-queries-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<img class="entity-img" src="images/entities/colorized/person_default.png">'), $("#trending-queries-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<div class="person-entity-static trend-text">' + e[a].entity1 + "</div>")) : "concept" == e[a].entity1Type ? ($("#trending-queries-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<img class="entity-img" src="images/entities/colorized/concept_default.png">'), $("#trending-queries-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<div class="concept-entity-static trend-text">' + e[a].entity1 + "</div>")) : ($("#trending-queries-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<img class="entity-img" src="images/entities/colorized/flintstone_default.png">'), $("#trending-queries-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<div class="flintstone-entity-static trend-text">' + e[a].entity1 + "</div>")),
            //     $("#trending-queries-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<span class="trend-text connection-dash"> + </span>'),
            //     "company" == e[a].entity2Type ? ($("#trending-queries-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<img class="entity-img" src="images/entities/colorized/company_default.png">'), $("#trending-queries-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<div class="company-entity-static trend-text">' + e[a].entity2 + "</div>")) : "organization" == e[a].entity2Type ? ($("#trending-queries-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<img class="entity-img" src="images/entities/colorized/organization_default.png">'), $("#trending-queries-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<div class="organization-entity-static trend-text">' + e[a].entity2 + "</div>")) : "person" == e[a].entity2Type ? ($("#trending-queries-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<img class="entity-img" src="images/entities/colorized/person_default.png">'), $("#trending-queries-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<div class="person-entity-static trend-text">' + e[a].entity2 + "</div>")) : "concept" == e[a].entity1Type ? ($("#trending-queries-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<img class="entity-img" src="images/entities/colorized/concept_default.png">'), $("#trending-queries-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<div class="concept-entity-static trend-text">' + e[a].entity2 + "</div>")) : ($("#trending-queries-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<img class="entity-img" src="images/entities/colorized/flintstone_default.png">'), $("#trending-queries-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<div class="flintstone-entity-static trend-text">' + e[a].entity2 + "</div>"))
        } else if ("connection" != e[a].type) {
            var u = e[a].query,
                d = e[a].type,
                c = "newsQuery('" + u + "', '" + d + "')";
            // $("#trending-queries-panel #sub-panel .trend-path:nth-child(" + i + ")").attr("onclick", c),
            //     "company" == e[a].type ? ($("#trending-queries-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<img class="entity-img" src="images/entities/colorized/company_default.png">'), $("#trending-queries-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<div class="company-entity-static trend-text">' + e[a].query + "</div>")) : "organization" == e[a].type ? ($("#trending-queries-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<img class="entity-img" src="images/entities/colorized/organization_default.png">'), $("#trending-queries-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<div class="organization-entity-static trend-text">' + e[a].query + "</div>")) : "person" == e[a].type ? ($("#trending-queries-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<img class="entity-img" src="images/entities/colorized/person_default.png">'), $("#trending-queries-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<div class="person-entity-static trend-text">' + e[a].query + "</div>")) : "concept" == e[a].type ? ($("#trending-queries-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<img class="entity-img" src="images/entities/colorized/concept_default.png">'), $("#trending-queries-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<div class="concept-entity-static trend-text">' + e[a].query + "</div>")) : ($("#trending-queries-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<img class="entity-img" src="images/entities/colorized/flintstone_default.png">'), $("#trending-queries-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<div class="flintstone-entity-static trend-text">' + e[a].query + "</div>"))
        }
    }
    adjustLanding()
}
function populateTrendingConnections() {
    var e = [{
        type: "connection",
        entity1Type: "company",
        entity1: "IBM",
        entity2Type: "person",
        entity2: "Bob Dylan"
    },
        {
            type: "company",
            query: "Apple"
        },
        {
            type: "person",
            query: "Donald Trump"
        },
        {
            type: "connection",
            entity1Type: "organization",
            entity1: "NSA",
            entity2Type: "person",
            entity2: "Edward Snowden"
        },
        {
            type: "organization",
            query: "National Foundation for the Arts"
        },
        {
            type: "person",
            query: "Hillary Clinton"
        },
        {
            type: "company",
            query: "The Walt Disney Company"
        },
        {
            type: "person",
            query: "Barack Obama"
        }];
    if (useRestServer) {
        var t = restServerURL + "/api/trendingQueries/?type=connections";
        $.getJSON(t,
            function(t, n) {
                "success" == n && (e = t.trendingQueries),
                    renderConnections(e)
            })
    } else renderConnections(e)
}
function renderConnections(e) {
    $("#trending-connections-panel #sub-panel .trend-path .trend-cell").empty();
    var t = $("#trending-connections-panel #sub-panel .trend-path .trend-cell").length,
        n = e.length;
    n > t && (n = t);
    for (var i = 1; t >= i; i++) {
        var a = i - 1;
        if ("connection" == e[a].type) {
            var o = e[a].entity1,
                r = e[a].entity1Type,
                s = e[a].entity2,
                l = e[a].entity2Type,
                c = "newsConnectionQuery('" + o + "', '" + r + "', '" + s + "', '" + l + "')";
            // $("#trending-connections-panel #sub-panel .trend-path:nth-child(" + i + ")").attr("onclick", c),
            //     "company" == e[a].entity1Type ? ($("#trending-connections-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<img class="entity-img" src="images/entities/colorized/company_default.png">'), $("#trending-connections-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<div class="company-entity-static trend-text">' + e[a].entity1 + "</div>")) : "organization" == e[a].entity1Type ? ($("#trending-connections-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<img class="entity-img" src="images/entities/colorized/organization_default.png">'), $("#trending-connections-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<div class="organization-entity-static trend-text">' + e[a].entity1 + "</div>")) : "person" == e[a].entity1Type ? ($("#trending-connections-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<img class="entity-img" src="images/entities/colorized/person_default.png">'), $("#trending-connections-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<div class="person-entity-static trend-text">' + e[a].entity1 + "</div>")) : "concept" == e[a].entity1Type ? ($("#trending-connections-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<img class="entity-img" src="images/entities/colorized/concept_default.png">'), $("#trending-connections-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<div class="concept-entity-static trend-text">' + e[a].entity1 + "</div>")) : ($("#trending-connections-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<img class="entity-img" src="images/entities/colorized/flintstone_default.png">'), $("#trending-connections-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<div class="flintstone-entity-static trend-text">' + e[a].entity1 + "</div>")),
            //     $("#trending-connections-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<span class="trend-text connection-dash"> + </span>'),
            //     "company" == e[a].entity2Type ? ($("#trending-connections-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<img class="entity-img" src="images/entities/colorized/company_default.png">'), $("#trending-connections-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<div class="company-entity-static trend-text">' + e[a].entity2 + "</div>")) : "organization" == e[a].entity2Type ? ($("#trending-connections-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<img class="entity-img" src="images/entities/colorized/organization_default.png">'), $("#trending-connections-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<div class="organization-entity-static trend-text">' + e[a].entity2 + "</div>")) : "person" == e[a].entity2Type ? ($("#trending-connections-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<img class="entity-img" src="images/entities/colorized/person_default.png">'), $("#trending-connections-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<div class="person-entity-static trend-text">' + e[a].entity2 + "</div>")) : "concept" == e[a].entity1Type ? ($("#trending-connections-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<img class="entity-img" src="images/entities/colorized/concept_default.png">'), $("#trending-connections-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<div class="concept-entity-static trend-text">' + e[a].entity2 + "</div>")) : ($("#trending-connections-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<img class="entity-img" src="images/entities/colorized/flintstone_default.png">'), $("#trending-connections-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<div class="flintstone-entity-static trend-text">' + e[a].entity2 + "</div>"))
        } else if ("connection" != e[a].type) {
            var u = e[a].query,
                d = e[a].type,
                c = "newsQuery('" + u + "', '" + d + "')";
            // $("#trending-connections-panel #sub-panel .trend-path:nth-child(" + i + ")").attr("onclick", c),
            //     "company" == e[a].type ? ($("#trending-connections-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<img class="entity-img" src="images/entities/colorized/company_default.png">'), $("#trending-connections-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<div class="company-entity-static trend-text">' + e[a].query + "</div>")) : "organization" == e[a].type ? ($("#trending-connections-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<img class="entity-img" src="images/entities/colorized/organization_default.png">'), $("#trending-connections-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<div class="organization-entity-static trend-text">' + e[a].query + "</div>")) : "person" == e[a].type ? ($("#trending-connections-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<img class="entity-img" src="images/entities/colorized/person_default.png">'), $("#trending-connections-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<div class="person-entity-static trend-text">' + e[a].query + "</div>")) : "concept" == e[a].type ? ($("#trending-connections-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<img class="entity-img" src="images/entities/colorized/concept_default.png">'), $("#trending-connections-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<div class="concept-entity-static trend-text">' + e[a].query + "</div>")) : ($("#trending-connections-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<img class="entity-img" src="images/entities/colorized/flintstone_default.png">'), $("#trending-connections-panel #sub-panel .trend-path:nth-child(" + i + ") .trend-cell").append('<div class="flintstone-entity-static trend-text">' + e[a].query + "</div>"))
        }
    }
    adjustLanding()
}
function populateBreakingNews() {
    var e = [[{
        name: "Google",
        degree: "9",
        type: "company"
    },
        {
            name: "Donald Trump",
            degree: "7",
            type: "person"
        },
        {
            name: "NSA",
            degree: "6",
            type: "organization"
        },
        {
            name: "Big Data",
            degree: "5",
            type: "concept"
        },
        {
            name: "Apple",
            degree: "5",
            type: "company"
        },
        {
            name: "Hillary Clinton",
            degree: "5",
            type: "person"
        },
        {
            name: "NNATO",
            degree: "4",
            type: "organization"
        },
        {
            name: "Petroleum",
            degree: "4",
            type: "concept"
        },
        {
            name: "Exxon Mobil",
            degree: "3",
            type: "company"
        },
        {
            name: "Jack Black",
            degree: "3",
            type: "person"
        },
        {
            name: "National Cancer Association",
            degree: "2",
            type: "organization"
        },
        {
            name: "Flood",
            degree: "1",
            type: "concept"
        }], [{
        name: "Google",
        degree: "8",
        type: "company"
    },
        {
            name: "Donald Trump",
            degree: "7",
            type: "person"
        },
        {
            name: "NSA",
            degree: "6",
            type: "organization"
        },
        {
            name: "Big Data",
            degree: "5",
            type: "concept"
        },
        {
            name: "Apple",
            degree: "5",
            type: "company"
        },
        {
            name: "Hillary Clinton",
            degree: "5",
            type: "person"
        },
        {
            name: "NNATO",
            degree: "4",
            type: "organization"
        },
        {
            name: "Petroleum",
            degree: "4",
            type: "concept"
        },
        {
            name: "Exxon Mobil",
            degree: "3",
            type: "company"
        },
        {
            name: "Jack Black",
            degree: "3",
            type: "person"
        },
        {
            name: "National Cancer Association",
            degree: "2",
            type: "organization"
        },
        {
            name: "Flood",
            degree: "1",
            type: "concept"
        }], [{
        name: "Google",
        degree: "8",
        type: "company"
    },
        {
            name: "Donald Trump",
            degree: "7",
            type: "person"
        },
        {
            name: "NSA",
            degree: "6",
            type: "organization"
        },
        {
            name: "Big Data",
            degree: "5",
            type: "concept"
        },
        {
            name: "Apple",
            degree: "5",
            type: "company"
        },
        {
            name: "Hillary Clinton",
            degree: "5",
            type: "person"
        },
        {
            name: "NNATO",
            degree: "4",
            type: "organization"
        },
        {
            name: "Petroleum",
            degree: "4",
            type: "concept"
        },
        {
            name: "Exxon Mobil",
            degree: "3",
            type: "company"
        },
        {
            name: "Jack Black",
            degree: "3",
            type: "person"
        },
        {
            name: "National Cancer Association",
            degree: "2",
            type: "organization"
        },
        {
            name: "Flood",
            degree: "1",
            type: "concept"
        }], [{
        name: "Google",
        degree: "8",
        type: "company"
    },
        {
            name: "Donald Trump",
            degree: "7",
            type: "person"
        },
        {
            name: "NSA",
            degree: "6",
            type: "organization"
        },
        {
            name: "Big Data",
            degree: "5",
            type: "concept"
        },
        {
            name: "Hillary Clinton",
            degree: "5",
            type: "person"
        },
        {
            name: "NNATO",
            degree: "4",
            type: "organization"
        },
        {
            name: "Petroleum",
            degree: "4",
            type: "concept"
        },
        {
            name: "Exxon Mobil",
            degree: "3",
            type: "company"
        },
        {
            name: "Jack Black",
            degree: "3",
            type: "person"
        },
        {
            name: "National Cancer Association",
            degree: "2",
            type: "organization"
        },
        {
            name: "Flood",
            degree: "1",
            type: "concept"
        }], [{
        name: "Google",
        degree: "8",
        type: "company"
    },
        {
            name: "Donald Trump",
            degree: "7",
            type: "person"
        },
        {
            name: "NSA",
            degree: "6",
            type: "organization"
        },
        {
            name: "Apple",
            degree: "5",
            type: "company"
        },
        {
            name: "Hillary Clinton",
            degree: "5",
            type: "person"
        },
        {
            name: "NNATO",
            degree: "4",
            type: "organization"
        },
        {
            name: "Petroleum",
            degree: "4",
            type: "concept"
        },
        {
            name: "Exxon Mobil",
            degree: "3",
            type: "company"
        },
        {
            name: "Jack Black",
            degree: "3",
            type: "person"
        },
        {
            name: "National Cancer Association",
            degree: "2",
            type: "organization"
        },
        {
            name: "Flood",
            degree: "1",
            type: "concept"
        }], [{
        name: "Google",
        degree: "8",
        type: "company"
    },
        {
            name: "Donald Trump",
            degree: "7",
            type: "person"
        },
        {
            name: "NSA",
            degree: "6",
            type: "organization"
        },
        {
            name: "Big Data",
            degree: "5",
            type: "concept"
        },
        {
            name: "Apple",
            degree: "5",
            type: "company"
        },
        {
            name: "Hillary Clinton",
            degree: "5",
            type: "person"
        },
        {
            name: "NNATO",
            degree: "4",
            type: "organization"
        },
        {
            name: "Petroleum",
            degree: "4",
            type: "concept"
        },
        {
            name: "Exxon Mobil",
            degree: "3",
            type: "company"
        },
        {
            name: "Jack Black",
            degree: "3",
            type: "person"
        },
        {
            name: "National Cancer Association",
            degree: "2",
            type: "organization"
        },
        {
            name: "Flood",
            degree: "1",
            type: "concept"
        }], [{
        name: "Google",
        degree: "8",
        type: "company"
    },
        {
            name: "Donald Trump",
            degree: "7",
            type: "person"
        },
        {
            name: "NSA",
            degree: "6",
            type: "organization"
        },
        {
            name: "Big Data",
            degree: "5",
            type: "concept"
        },
        {
            name: "Apple",
            degree: "5",
            type: "company"
        },
        {
            name: "Hillary Clinton",
            degree: "5",
            type: "person"
        },
        {
            name: "NNATO",
            degree: "4",
            type: "organization"
        },
        {
            name: "Petroleum",
            degree: "4",
            type: "concept"
        },
        {
            name: "Jack Black",
            degree: "3",
            type: "person"
        },
        {
            name: "National Cancer Association",
            degree: "2",
            type: "organization"
        },
        {
            name: "Flood",
            degree: "1",
            type: "concept"
        }], [{
        name: "Google",
        degree: "8",
        type: "company"
    },
        {
            name: "Donald Trump",
            degree: "7",
            type: "person"
        },
        {
            name: "Big Data",
            degree: "5",
            type: "concept"
        },
        {
            name: "Apple",
            degree: "5",
            type: "company"
        },
        {
            name: "Hillary Clinton",
            degree: "5",
            type: "person"
        },
        {
            name: "NNATO",
            degree: "4",
            type: "organization"
        },
        {
            name: "Petroleum",
            degree: "4",
            type: "concept"
        },
        {
            name: "Exxon Mobil",
            degree: "3",
            type: "company"
        },
        {
            name: "Jack Black",
            degree: "3",
            type: "person"
        },
        {
            name: "National Cancer Association",
            degree: "2",
            type: "organization"
        },
        {
            name: "Flood",
            degree: "1",
            type: "concept"
        }], [{
        name: "Google",
        degree: "8",
        type: "company"
    },
        {
            name: "Donald Trump",
            degree: "7",
            type: "person"
        },
        {
            name: "NSA",
            degree: "6",
            type: "organization"
        },
        {
            name: "Big Data",
            degree: "5",
            type: "concept"
        },
        {
            name: "Apple",
            degree: "5",
            type: "company"
        },
        {
            name: "Hillary Clinton",
            degree: "5",
            type: "person"
        },
        {
            name: "NNATO",
            degree: "4",
            type: "organization"
        },
        {
            name: "Petroleum",
            degree: "4",
            type: "concept"
        },
        {
            name: "Exxon Mobil",
            degree: "3",
            type: "company"
        },
        {
            name: "Jack Black",
            degree: "3",
            type: "person"
        },
        {
            name: "National Cancer Association",
            degree: "2",
            type: "organization"
        },
        {
            name: "Flood",
            degree: "1",
            type: "concept"
        }], [{
        name: "Google",
        degree: "8",
        type: "company"
    },
        {
            name: "Donald Trump",
            degree: "7",
            type: "person"
        },
        {
            name: "NSA",
            degree: "6",
            type: "organization"
        },
        {
            name: "Big Data",
            degree: "5",
            type: "concept"
        },
        {
            name: "Apple",
            degree: "5",
            type: "company"
        },
        {
            name: "NNATO",
            degree: "4",
            type: "organization"
        },
        {
            name: "Petroleum",
            degree: "4",
            type: "concept"
        },
        {
            name: "Exxon Mobil",
            degree: "3",
            type: "company"
        },
        {
            name: "Jack Black",
            degree: "3",
            type: "person"
        },
        {
            name: "National Cancer Association",
            degree: "2",
            type: "organization"
        },
        {
            name: "Flood",
            degree: "1",
            type: "concept"
        }], [{
        name: "Google",
        degree: "8",
        type: "company"
    },
        {
            name: "Donald Trump",
            degree: "7",
            type: "person"
        },
        {
            name: "NSA",
            degree: "6",
            type: "organization"
        },
        {
            name: "Big Data",
            degree: "5",
            type: "concept"
        },
        {
            name: "Apple",
            degree: "5",
            type: "company"
        },
        {
            name: "Hillary Clinton",
            degree: "5",
            type: "person"
        },
        {
            name: "NNATO",
            degree: "4",
            type: "organization"
        },
        {
            name: "Petroleum",
            degree: "4",
            type: "concept"
        },
        {
            name: "Exxon Mobil",
            degree: "3",
            type: "company"
        },
        {
            name: "Jack Black",
            degree: "3",
            type: "person"
        },
        {
            name: "National Cancer Association",
            degree: "2",
            type: "organization"
        }]];
    if (useRestServer) {
        //var t = restServerURL + "/api/overview";
        var t = "images/foreign/overview.json";
        $.getJSON(t,
            function(t, n) {
                "success" == n && (e = [], e.push(t["Current Events"]), e.push(t["Art and Entertainment"]), e.push(t["Business and Industrial"]), e.push(t.Education), e.push(t.Finance), e.push(t["Health and Fitness"]), e.push(t["Law, Government and Politics"]), e.push(t["Religion and Spirituality"]), e.push(t.Science), e.push(t.Sports), e.push(t["Technology and Computing"])),
                    renderBreakingNews(e)
            })
    } else renderBreakingNews(e)
}
function renderBreakingNews(e) {
    $("#breaking-news-panel #sub-panel #breaking-rows .breaking-row").empty();
    for (var t = $("#breaking-news-panel #sub-panel #breaking-rows .breaking-row").length, n = 1; t >= n; n++) for (var i = n - 1,
                                                                                                                        a = e[i][0].degree, o = $(".breaking-row").height() / a, r = e[i].length, s = 1; r >= s; s++) {
        var l = s - 1;
        $(".breaking-row:nth-child(" + n + ")").append("company" == e[i][l].type ? '<a class="company-entity breaking-text">' + e[i][l].name + "</div>": "organization" == e[i][l].type ? '<a class="organization-entity breaking-text">' + e[i][l].name + "</div>": "person" == e[i][l].type ? '<a class="person-entity breaking-text">' + e[i][l].name + "</div>": "concept" == e[i][l].type ? '<a class="concept-entity breaking-text">' + e[i][l].name + "</div>": '<a class="flintstone-entity breaking-text">' + e[i][l].name + "</div>"),
            $(".breaking-row:nth-child(" + n + ")").attr({
                degree: e[i][l].degree
            });
        var c = 1,
            u = e[i][l].degree * o - c;
        8 > u && (u = 8),
            $(".breaking-row:nth-child(" + n + ") .breaking-text:nth-child(" + s + ")").css({
                "font-size": u + "px"
            });
        var d = e[i][l].name,
            p = e[i][l].type,
            h = "newsQuery('" + d + "', '" + p + "')";
        $(".breaking-row:nth-child(" + n + ") .breaking-text:nth-child(" + s + ")").attr("onclick", h)
    }
    adjustLanding(),
        $("#watson-logo-container").hide()
}
function obtainCountryActivityState(e) {
    for (var t = 0; t < includedCountries.length; t++) if (e === includedCountries[t]) return e === selectedCountryCode ? "#B4E051": _.some(associatedLocations,
        function(t) {
            return returnCountryCodeIfExists(t) === e
        }) ? "#2D660A": "#8CC63F";
    return "#3C4646"
}
function getLatitude(e) {
    var t = e;
    return t = t.split(" "),
        t[0]
}
function getLongitude(e) {
    var t = e;
    return t = t.split(" "),
        t[1]
}
function returnCountryCodeIfExists(e) {
    for (var t = 0,
             n = possibleCountries.length; n > t; t++) if (e === possibleCountries[t].properties.name) return possibleCountries[t].id;
    return "none"
}
function expandPossibleCountries() {
    possibleCountries = Datamap.prototype.worldTopo.objects.world.geometries;
    for (var e, t = Datamap.prototype.worldTopo.objects.world.geometries.length,
             n = 0; t > n; n++)"United Arab Emirates" === possibleCountries[n].properties.name ? (e = $.extend(!0, {},
        possibleCountries[n]), e.properties.name = "UAE", possibleCountries.push(e)) : "Ivory Coast" === possibleCountries[n].properties.name ? (e = $.extend(!0, {},
        possibleCountries[n]), e.properties.name = "Côte d'Ivoire", possibleCountries.push(e)) : "Democratic Republic of Congo" === possibleCountries[n].properties.name ? (e = $.extend(!0, {},
        possibleCountries[n]), e.properties.name = "Congo", possibleCountries.push(e)) : "Republic of Serbia" === possibleCountries[n].properties.name ? (e = $.extend(!0, {},
        possibleCountries[n]), e.properties.name = "Serbia", possibleCountries.push(e)) : "United Republic of Tanzania" === possibleCountries[n].properties.name ? (e = $.extend(!0, {},
        possibleCountries[n]), e.properties.name = "Tanzania", possibleCountries.push(e)) : "United Kingdom" === possibleCountries[n].properties.name ? (e = $.extend(!0, {},
        possibleCountries[n]), e.properties.name = "The United Kingdom", possibleCountries.push(e), e = $.extend(!0, {},
        possibleCountries[n]), e.properties.name = "U.K.", possibleCountries.push(e), e = $.extend(!0, {},
        possibleCountries[n]), e.properties.name = "U.K", possibleCountries.push(e), e = $.extend(!0, {},
        possibleCountries[n]), e.properties.name = "UK", possibleCountries.push(e), e = $.extend(!0, {},
        possibleCountries[n]), e.properties.name = "Great Britain", possibleCountries.push(e), e = $.extend(!0, {},
        possibleCountries[n]), e.properties.name = "Britain", possibleCountries.push(e)) : "United States of America" === possibleCountries[n].properties.name && (e = $.extend(!0, {},
        possibleCountries[n]), e.properties.name = "The United States of America", possibleCountries.push(e), e = $.extend(!0, {},
        possibleCountries[n]), e.properties.name = "The United States", possibleCountries.push(e), e = $.extend(!0, {},
        possibleCountries[n]), e.properties.name = "United States", possibleCountries.push(e), e = $.extend(!0, {},
        possibleCountries[n]), e.properties.name = "USA", possibleCountries.push(e), e = $.extend(!0, {},
        possibleCountries[n]), e.properties.name = "U.S.", possibleCountries.push(e), e = $.extend(!0, {},
        possibleCountries[n]), e.properties.name = "U.S", possibleCountries.push(e), e = $.extend(!0, {},
        possibleCountries[n]), e.properties.name = "US", possibleCountries.push(e))
}
function showLocationList(e) {
    e ? $("#location-entities").css("visibility", "visible") : $("#location-entities").css("visibility", "hidden")
}
function resetLocationRadioButtons() {
    $("#locations-view-map").prop("checked", !0),
        $("#locations-view-list").prop("checked", !1)
}
function nodeSize(e) {
    var t = 64 + ("article" != e.type ? 20 * Math.log(e.degree) : 0);
    return t
}
function linkWidth(e) {
    return 4
}
function zoomed() {
    this.graphViz.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")")
}
function nodeType(e) {
    return _.contains(imageTypes, e.type) ? e.type: "other"
}
function getTimeRangeMillis(e, t) {
    var n = e,
        i = t,
        a = n.getTime(),
        o = i.getTime(),
        r = o - a;
    return r
}
function updatePrintedTime(e) {
    var t = Math.floor(e / dayInMillis),
        n = Math.floor((e - t * dayInMillis) / hourInMillis),
        i = Math.floor((e - (t * dayInMillis + n * hourInMillis)) / minuteInMillis),
        a = Math.floor((e - (t * dayInMillis + n * hourInMillis + i * minuteInMillis)) / secondInMillis);
    $("#timeline-days").text("0" == e ? "past 30": t),
        $("#timeline-hours").text(n),
        $("#timeline-minutes").text(i),
        $("#timeline-seconds").text(a);
    var o = new Date;
    $("#current-time-and-date").text(o.getMonth() + 1 + "/" + o.getDate() + "/" + o.getFullYear())
}
var ajaxRequest = null,
    entityMap = {},
    nodes = [],
    links = [],
    id = 0,
    nameMap = [];
Client.prototype = {
    constructor: Client,
    loginGuest: function(e) {
        this.login(null, null, e)
    },
    login: function(e, t, n) {
        var i = this;
        return null != this.getWebSocket() && this.getWebSocket().readyState !== WebSocket.CLOSED ? void this.onLog("WebSocket is already opened.") : (this.setWebSocket(new WebSocket(this.getEndpoint())), this.webSocket.onopen = function(a) {
            var o = window.JSON.stringify({
                apikey: i.getAPIKey(),
                request: "LOGIN",
                parameters: {
                    EMAIL: e,
                    PASSWORD: $.md5(t),
                    ADD_DEFAULT_GRAPHS: n
                }
            });
            i.webSocket.send(o),
                i.onLog("Sent LOGIN request.")
        },
            this.webSocket.onmessage = function(e) {
                try {
                    var t = JSON.parse(e.data);
                    switch (t.response) {
                        case "ERROR":
                            i.onError(t.message);
                            break;
                        case "INFO":
                            i.onLog(t.message);
                            break;
                        case "ABOUT":
                            i.onAbout(t.about);
                            break;
                        case "NODE_POSITIONS":
                            i.onNodePositions(t.nodes);
                            break;
                        case "GRAPH":
                            i.onGraph(t.graph);
                            break;
                        case "GRAPHS":
                            i.onGraphs(t.graphs);
                            break;
                        case "METRIC":
                            i.onMetric(t.metric);
                            break;
                        case "FUNCTIONAL_INFO":
                            i.onFunctionalInfo(t.functionalInfo);
                            break;
                        case "CONFIGURATION_PARAMETERS":
                            i.onConfigurationParameters(t.configurationParameters);
                            break;
                        case "TOKEN":
                            document.cookie = "token=" + t.token,
                                i.onLogin(t.token);
                            break;
                        default:
                            i.onError("No handling strategy for response '" + t.response + "' defined.")
                    }
                } catch(n) {}
            },
            this.webSocket.onerror = function(e) {
                i.onError(e.data)
            },
            void(this.webSocket.onclose = function(e) {
                i.onLogout(e.data)
            }))
    },
    onLogout: function(e) {
        for (var t in this.getListeners())"function" == typeof this.getListeners()[t].onLogout && this.getListeners()[t].onLogout(e)
    },
    onLogin: function() {
        for (var e in this.getListeners())"function" == typeof this.getListeners()[e].onLogin && this.getListeners()[e].onLogin()
    },
    onError: function(e) {
        for (var t in this.getListeners())"function" == typeof this.getListeners()[t].onError && this.getListeners()[t].onError(e)
    },
    onLog: function(e) {
        for (var t in this.getListeners())"function" == typeof this.getListeners()[t].onLog && this.getListeners()[t].onLog(e)
    },
    onAbout: function(e) {
        for (var t in this.getListeners())"function" == typeof this.getListeners()[t].onAbout && this.getListeners()[t].onAbout(e)
    },
    onNodePositions: function(e) {
        for (var t in this.getListeners())"function" == typeof this.getListeners()[t].onNodePositions && this.getListeners()[t].onNodePositions(e)
    },
    onGraph: function(e) {
        for (var t in this.getListeners())"function" == typeof this.getListeners()[t].onGraph && this.getListeners()[t].onGraph(e)
    },
    onGraphs: function(e) {
        for (var t in this.getListeners())"function" == typeof this.getListeners()[t].onGraphs && this.getListeners()[t].onGraphs(e)
    },
    onMetric: function(e) {
        for (var t in this.getListeners())"function" == typeof this.getListeners()[t].onMetric && this.getListeners()[t].onMetric(e)
    },
    onFunctionalInfo: function(e) {
        for (var t in this.getListeners())"function" == typeof this.getListeners()[t].onFunctionalInfo && this.getListeners()[t].onFunctionalInfo(e)
    },
    onConfigurationParameters: function(e) {
        for (var t in this.getListeners())"function" == typeof this.getListeners()[t].onConfigurationParameters && this.getListeners()[t].onConfigurationParameters(e)
    },
    getAbout: function() {
        var e = window.JSON.stringify({
            apikey: this.getAPIKey(),
            request: "GET_ABOUT",
            token: this.getToken()
        });
        this.webSocket.send(e),
            this.onLog("Sent PUT_GRAPH request.")
    },
    putGraph: function(e, t, n, i, a, o, r, s, l) {
        var c = window.JSON.stringify({
            apikey: this.getAPIKey(),
            request: "PUT_GRAPH",
            token: this.getToken(),
            graph: {
                name: e,
                nodes: t,
                edges: n,
                nodeAttributes: i,
                nodeAttributeTypes: a,
                nodeAttributeLabels: o,
                edgeAttributes: r,
                edgeAttributeTypes: s,
                edgeAttributeLabels: l
            }
        });
        console.log(c)
        this.webSocket.send(c),
            this.onLog("Sent PUT_GRAPH request.")
    },
    renameGraph: function(e) {
        var t = window.JSON.stringify({
            apikey: this.getAPIKey(),
            request: "RENAME_GRAPH",
            token: this.getToken(),
            parameters: {
                GRAPH_NAME: e
            }
        });
        this.webSocket.send(t),
            this.onLog("Sent RENAME_GRAPH request.")
    },
    persistNode: function(e) {
        var t = window.JSON.stringify({
            apikey: this.getAPIKey(),
            request: "PERSIST_NODE",
            token: this.getToken(),
            nodes: [e]
        });
        this.webSocket.send(t),
            this.onLog("Sent PERSIST_NODE request.")
    },
    persistEdge: function(e) {
        var t = window.JSON.stringify({
            apikey: this.getAPIKey(),
            request: "PERSIST_EDGE",
            token: this.getToken(),
            edges: [e]
        });
        this.webSocket.send(t),
            this.onLog("Sent PERSIST_EDGE request.")
    },
    deleteGraph: function(e) {
        var t = window.JSON.stringify({
            apikey: this.getAPIKey(),
            request: "DELETE_GRAPH",
            token: this.getToken(),
            graph: {
                id: e
            }
        });
        this.webSocket.send(t),
            this.onLog("Sent DELETE_GRAPH request.")
    },
    deleteNode: function(e) {
        var t = window.JSON.stringify({
            apikey: this.getAPIKey(),
            request: "DELETE_NODE",
            token: this.getToken(),
            nodes: [{
                id: e
            }]
        });
        this.webSocket.send(t),
            this.onLog("Sent DELETE_NODE request.")
    },
    getGraph: function(e) {
        var t = window.JSON.stringify({
            apikey: this.getAPIKey(),
            request: "GET_GRAPH",
            token: this.getToken(),
            parameters: {
                GRAPH_ID: e
            }
        });
        this.webSocket.send(t),
            this.onLog("Sent GET_GRAPH request.")
    },
    layoutGraph: function(e, t) {
        var n = window.JSON.stringify({
            apikey: this.getAPIKey(),
            request: "LAYOUT_GRAPH",
            token: this.getToken(),
            algorithm: e,
            parameters: t
        });
        this.webSocket.send(n),
            this.onLog("Sent LAYOUT_GRAPH request.")
    },
    setScaleNodeRadius: function(e) {
        var t = window.JSON.stringify({
            apikey: this.getAPIKey(),
            request: "SET_SCALE_NODE_RADIUS",
            token: this.getToken(),
            parameters: {
                SCALE_NODE_RADIUS: e
            }
        });
        this.webSocket.send(t),
            this.onLog("Sent SET_SCALE_NODE_RADIUS request.")
    },
    setScaleMinMax: function(e) {
        var t = window.JSON.stringify({
            apikey: this.getAPIKey(),
            request: "SET_SCALE_MIN_MAX",
            token: this.getToken(),
            parameters: {
                SCALE_MIN_MAX: e
            }
        });
        this.webSocket.send(t),
            this.onLog("Sent SET_SCALE_MIN_MAX request.")
    },
    deserializeGraphml: function(e, t) {
        var n = window.JSON.stringify({
            apikey: this.getAPIKey(),
            request: "DESERIALIZE_GRAPHML",
            token: this.getToken(),
            message: e,
            parameters: {
                GRAPH_NAME: t
            }
        });
        this.webSocket.send(n),
            this.onLog("Sent DESERIALIZE_GRAPHML request.")
    },
    getConfigurationParameters: function(e) {
        var t = window.JSON.stringify({
            apikey: this.getAPIKey(),
            request: "GET_CONFIGURATION_PARAMETERS",
            token: this.getToken(),
            algorithm: e
        });
        this.webSocket.send(t)
    },
    logout: function() {
        this.webSocket.close(),
            this.webSocket = void 0
    },
    register: function(e) {
        this.getListeners().push(e)
    },
    renameAttribute: function(e, t) {
        var n = window.JSON.stringify({
            apikey: this.getAPIKey(),
            request: "RENAME_ATTRIBUTE",
            parameters: {
                ATTRIBUTE_ID: e,
                ATTRIBUTE_NAME: t
            },
            token: this.getToken()
        });
        this.webSocket.send(n)
    },
    editAttributeValue: function(e, t, n) {
        var i = window.JSON.stringify({
            apikey: this.getAPIKey(),
            request: "EDIT_ATTRIBUTE_VALUE",
            parameters: {
                ATTRIBUTE_ID: e,
                OBJECT_ID: t,
                VALUE: n
            },
            token: this.getToken()
        });
        this.webSocket.send(i)
    },
    getToken: function() {
        for (var e = "token=",
                 t = document.cookie.split(";"), n = 0; n < t.length; n++) {
            for (var i = t[n];
                 " " == i.charAt(0);) i = i.substring(1);
            if (0 == i.indexOf(e)) return i.substring(e.length, i.length)
        }
        return ""
    }
};
var DBPedia = function() {
    this.endpoint = "http://dbpedia.org/sparql/",
        String.prototype.replaceAll = function(e, t) {
            return this.split(e).join(t)
        }
};
DBPedia.prototype.getData = function(e, t, n) {
    function i(n) {
        var i = {
            raw: n,
            dbpediaUrl: e,
            summary: null
        };
        n ? i.summary = a.extractSummary(e, n) : i.error = "Failed to retrieve data. Is the URL or page name correct?",
            t(i)
    }
    var a = this;
    // console.log("DBPedia: " + e),
    this.getRawJson(e, i, n)
},
    DBPedia.prototype.getRawJson = function(e, t, n) {
        var i = "	    PREFIX dbo: <http://dbpedia.org/ontology/>	    SELECT *	    WHERE {	        {<{{url}}> dbo:thumbnail ?image}	        UNION	    	{<{{url}}> dbo:abstract ?description}	    }";
        i = i.replaceAll("{{url}}", e);
        var a = encodeURI(this.endpoint + "?query=" + i + "&format=json");
        $.ajax({
            dataType: "jsonp",
            url: a,
            success: t,
            error: n
        })
    },
    DBPedia.prototype.getoldRawJson = function(e, t, n) {
        {
            var i = "DESCRIBE <{{url}}>".replace("{{url}}", e);
            $.ajax({
                type: "GET",
                url: this.endpoint,
                data: {
                    query: i,
                    format: "application/rdf+json"
                },
                contentType: "text/plain",
                dataType: "jsonp",
                timeout: 1e4,
                xhrFields: {
                    withCredentials: !1
                },
                success: t,
                error: n
            })
        }
    };
var PREFIX = {
    rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    rdfs: "http://www.w3.org/2000/01/rdf-schema#",
    xsd: "http://www.w3.org/2001/XMLSchema#",
    owl: "http://www.w3.org/2002/07/owl#",
    dc: "http://purl.org/dc/terms/",
    foaf: "http://xmlns.com/foaf/0.1/",
    vcard: "http://www.w3.org/2006/vcard/ns#",
    dbp: "http://dbpedia.org/property/",
    dbo: "http://dbpedia.org/ontology/",
    geo: "http://www.geonames.org/ontology#",
    wgs: "http://www.w3.org/2003/01/geo/wgs84_pos#"
};
DBPedia.prototype._expandNamespacePrefix = function(e) {
    for (var t in PREFIX) 0 === e.indexOf(t + ":") && (e = PREFIX[t] + e.slice(t.length + 1));
    return e
},
    DBPedia.prototype._lookupProperty = function(e, t) {
        if (null == e || null == t) return null;
        t = this._expandNamespacePrefix(t);
        var n = e[t];
        for (var i in n) if ("en" == n[i].lang) return n[i].value;
        var a;
        for (i in n) if (!n[i].lang && (a = n[i].value, isNaN(a) && "eng" === franc(a))) return a;
        for (i in n) if (!n[i].lang) return a = n[i].value
    },
    DBPedia.prototype.extractSummary = function(e, t) {
        var n = {},
            i = t.results.bindings;
        for (var a in i) {
            var o = i[a];
            for (var r in o) {
                var s = o[r]["xml:lang"],
                    l = o[r].value;
                "en" === s ? n[r] = l: null == s && null == n[r] && (n[r] = l)
            }
        }
        return n
    },
    DBPedia.prototype.oldextractSummary = function(e, t) {
        function n(e) {
            if (null == o) return void 0;
            if (e instanceof Array) {
                var t = [];
                for (var n in e) {
                    var i = a._lookupProperty(o, e[n]);
                    i && t.push(i)
                }
                return t
            }
            return a._lookupProperty(o, e)
        }
        function i(e) {
            var t = e.split("/");
            return t[t.length - 1]
        }
        var a = this,
            o = t[e],
            r = {
                title: n("rdfs:label"),
                description: n("dbo:abstract"),
                summary: n("rdfs:comment"),
                startDates: n(["dbo:birthDate", "dbo:formationDate", "dbo:foundingYear"]),
                endDates: n("dbo:deathDate"),
                date: n("dbo:date"),
                place: n("dbp:place"),
                birthPlace: n("dbo:birthPlace"),
                deathPlace: n("dbo:deathPlace"),
                source: n("foaf:page"),
                images: n(["dbo:thumbnail", "foaf:depiction", "foaf:img"]),
                location: {
                    lat: n("wgs:lat"),
                    lon: n("wgs:long")
                },
                types: [],
                type: null
            },
            s = this._expandNamespacePrefix("rdf:type");
        if (null != o) {
            var l = o[s];
            for (var c in l) {
                var u = l[c].value; ( - 1 != u.indexOf("dbpedia.org/ontology") || -1 != u.indexOf("schema.org") || -1 != u.indexOf("foaf/0.1")) && (r.types.push(i(u)), -1 != u.indexOf("schema.org") && (r.type = i(u)))
            } ! r.type && r.types.length > 0 && (r.type = r.types[0]),
                r.start = r.startDates.length > 0 ? r.startDates[0] : r.date,
                r.end = r.endDates,
            r.place || (r.place = r.deathPlace || r.birthPlace)
        }
        return r.place && (r.place = i(r.place)),
            r.location.title = r.place,
            r.image = r.images ? r.images[0] : null,
            r
    };
var timelineWidth, timelineHeight;
$(function() {
    $("#visualizations-area").css({
        height: $(window).height() - $("header").height() - 10 + "px"
    }),
        timelineWidth = $("#timeline").width(),
        timelineHeight = $("#timeline").height(),
        $(window).resize(function() {
            $("#visualizations-area").css({
                height: $(window).height() - $("header").height() - 10 + "px"
            }),
                timelineWidth = $("#timeline").width(),
                timelineHeight = $("#timeline").height()
        })
}),
    $(document).ready(function(e) {
        e("#zoom-button-in").on("mouseover",
            function() {
                src = e(this).attr("src").replace("_static.png", "_hover.png"),
                    e(this).attr("src", src)
            }),
            e("#zoom-button-in").on("mouseout",
                function() {
                    src = e(this).attr("src").replace("_hover.png", "_static.png"),
                        e(this).attr("src", src)
                }),
            e("#zoom-button-out").on("mouseover",
                function() {
                    src = e(this).attr("src").replace("_static.png", "_hover.png"),
                        e(this).attr("src", src)
                }),
            e("#zoom-button-out").on("mouseout",
                function() {
                    src = e(this).attr("src").replace("_hover.png", "_static.png"),
                        e(this).attr("src", src)
                })
    }),
    $(document).ready(function(e) {
        e("#zoom-button-in-map").on("mouseover",
            function() {
                src = e(this).attr("src").replace("_static.png", "_hover.png"),
                    e(this).attr("src", src)
            }),
            e("#zoom-button-in-map").on("mouseout",
                function() {
                    src = e(this).attr("src").replace("_hover.png", "_static.png"),
                        e(this).attr("src", src)
                }),
            e("#zoom-button-out-map").on("mouseover",
                function() {
                    src = e(this).attr("src").replace("_static.png", "_hover.png"),
                        e(this).attr("src", src)
                }),
            e("#zoom-button-out-map").on("mouseout",
                function() {
                    src = e(this).attr("src").replace("_hover.png", "_static.png"),
                        e(this).attr("src", src)
                })
    }),
    $(function() {
        $(document).ready(function(e) {
            var t = e(window).width();
            "1024" > t ? (e("#settings-area").css({
                visibility: "hidden"
            }), e("#settings-nav").css({
                visibility: "hidden"
            }), e("#cvl-logo-container").css({
                display: "none"
            }), e("#service-logo-container").css({
                display: "none"
            }), e("#visualizations-area").animate({
                    "margin-top": "0px"
                },
                {
                    duration: 200,
                    queue: !0
                })) : (e("#settings-area").css({
                visibility: "visible"
            }), e("#settings-nav").css({
                visibility: "visible"
            }), e("#cvl-logo-container").css({
                display: "inline"
            }), e("#service-logo-container").css({
                display: "inline"
            })),
                "1136" > t ? (e("#twitter").css({
                    display: "none"
                }), e("#about-nav").css({
                    display: "none"
                })) : (e("#twitter").css({
                    display: "inline"
                }), e("#about-nav").css({
                    display: "inline"
                })),
                "1440" > t ? (e("#find-panel").css({
                    width: "10%"
                }), e("#find-panel").css({
                    top: "50px"
                }), e("#find-panel").css({
                    right: "0px"
                })) : (e("#find-panel").css({
                    width: "15%"
                }), e("#find-panel").css({
                    top: "15px"
                }), e("#find-panel").css({
                    right: "170px"
                }));
            var n = Math.floor(e("#location-and-concepts-column").height() - e(".datamap").height() - 2 * e(".section-header-area").height());
            1 > n && (n = 1),
                e("#concept-cloud").css({
                    height: n
                })
        }),
            $(window).resize(function() {
                var e = $(window).width();
                viewFindMenu(!1),
                    "1024" > e ? ($("#settings-area").css({
                        visibility: "hidden"
                    }), $("#settings-nav").css({
                        visibility: "hidden"
                    }), $("#cvl-logo-container").css({
                        display: "none"
                    }), $("#service-logo-container").css({
                        display: "none"
                    }), $("#visualizations-area").animate({
                            "margin-top": "0px"
                        },
                        {
                            duration: 200,
                            queue: !0
                        })) : ($("#settings-area").css({
                        visibility: "visible"
                    }), $("#settings-nav").css({
                        visibility: "visible"
                    }), $("#cvl-logo-container").css({
                        display: "inline"
                    }), $("#service-logo-container").css({
                        display: "inline"
                    })),
                    "1136" > e ? ($("#twitter").css({
                        display: "none"
                    }), $("#about-nav").css({
                        display: "none"
                    })) : ($("#twitter").css({
                        display: "inline"
                    }), $("#about-nav").css({
                        display: "inline"
                    })),
                    "1440" > e ? ($("#find-panel").css({
                        width: "10%"
                    }), $("#find-panel").css({
                        top: "50px"
                    }), $("#find-panel").css({
                        right: "0px"
                    })) : ($("#find-panel").css({
                        width: "15%"
                    }), $("#find-panel").css({
                        top: "15px"
                    }), $("#find-panel").css({
                        right: "170px"
                    }));
                var t = Math.floor($("#location-and-concepts-column").height() - $(".datamap").height() - 2 * $(".section-header-area").height());
                1 > t && (t = 1),
                    $("#concept-cloud").css({
                        height: t
                    })
            })
    });
var video = $("#video"),
    creds = {
        speech_to_text: [{
            name: "Speech To Text-w5",
            label: "speech_to_text",
            plan: "standard",
            credentials: {
                url: "https://stream.watsonplatform.net/speech-to-text/api",
                username: "d8ae9282-6848-47c8-9e8c-eb01c8fcdef3",
                password: "aegCqf3wNOIc"
            }
        }]
    },
    ConceptCloud = function(e, t) {
        var n = this;
        this.divName = "#concept-cloud",
            this.eventBroker = e,
            this.selectionManager = t,
            this.selectedTopics = [],
            this.inactiveTopics = [],
            this.activeArticleIds = [],
            this.hoveredArticle = null,
            this.eventBroker.subscribe("selection.change",
                function() {
                    n.setTopicColors()
                }),
            this.eventBroker.subscribe("hover.add",
                function(e, t) {
                    var i = n.nodes[t];
                    n.hoveredArticle = "article" === i.type ? i: null,
                        n.setTopicColors()
                }),
            this.eventBroker.subscribe("hover.remove",
                function(e, t) {
                    n.hoveredArticle = null,
                        n.setTopicColors()
                }),
            this.eventBroker.subscribe("concept.select",
                function(e, t) {
                    //  console.log("concept " + t + " selected"),
                    "concept" != n.displayedType && ($("#" + n.displayedType).removeClass("cloudTab-selected"), $("#concept").addClass("cloudTab-selected"), n.displayedType = "concept", n.filter(), n.instantiateCloud()),
                        setTimeout(function() {
                                n.toggleSelection(t)
                            },
                            1e3)
                }),
            n.displayedType = "concept",
            $("#concept").addClass("cloudTab-selected"),
            $(".cloudTab").click(function() {
                console.log("tab clicked"),
                    $("#" + n.displayedType).removeClass("cloudTab-selected"),
                    $(this).addClass("cloudTab-selected"),
                    n.displayedType = this.id,
                    n.clearSelection(),
                    n.filter(),
                    n.instantiateCloud()
            }),
            $(".cloudTab").hover(function() {
                    $(this).css({
                        color: "#FFFFFF"
                    })
                },
                function() {
                    $(this).css({
                        color: "#E0E0E0"
                    })
                })
    },
    defaultColor = "#D0C7C7",
    associatedTopicColor = "#DB2780",
    selectedTopicColor = "#FF3CA0",
    impliedTopicColor = "#A6266E",
    inactiveTopicColor = "#777777",
    lowOpacity = .8,
    medOpacity = .9,
    highOpacity = 1;
ConceptCloud.prototype.data = function(e) {
    this.selectedTopics = [],
        this.inactiveTopics = [],
        this.activeArticleIds = [],
        this.setTopicColors(),
        this.nodes = e.nodes,
        this.links = e.links,
        Math.seedrandom(""),
        this.filter(),
        this.instantiateCloud()
},
    ConceptCloud.prototype.filter = function() {
        var e = this,
            t = _.filter(this.nodes,
                function(t) {
                    return t.type === e.displayedType
                });
        t.sort(function(e, t) {
            return t.degree - e.degree
        }),
            this.tags = t,
            this.topics = _.map(t,
                function(e) {
                    return e.name
                })
    },
    ConceptCloud.prototype.instantiateCloud = function() {
        var e = this,
            t = 0;
        null != $(".datamap").height() && (t = $(".datamap").height() + $(".section-header-area").height());
        var n = Math.floor($("#location-and-concepts-column").height() - t - $(".section-header-area").height() - 5);
        1 > n && (n = 1),
            $("#concept-cloud").css({
                height: n
            }),
            this.width = $(this.divName).width(),
            this.height = n,
            this.cloud = new CV.VisualizationWordCloud({
                container: $(this.divName),
                data: {
                    source: this.tags,
                    text: "name",
                    size: "degree"
                },
                font: "Open Sans",
                scale: "linear",
                colors: [defaultColor],
                opacity: lowOpacity,
                width: this.width,
                height: this.height,
                maxLabels: 100,
                textSizeMax: 75,
                textSizeMin: 12,
                textPadding: 2
            }),
            this.cloud.events.subscribe("clickedOnBackground",
                function(t) {
                    e.clearSelection()
                }),
            this.cloud.events.subscribe("accentuate",
                function(t, n) {
                    _.contains(e.inactiveTopics, n.text) || d3.selectAll("text").filter(function(e) {
                        return e.text == n.text
                    }).style({
                        opacity: medOpacity
                    })
                }),
            this.cloud.events.subscribe("deaccentuate",
                function(t, n) {
                    _.contains(e.inactiveTopics, n.text) || d3.selectAll("text").filter(function(e) {
                        return e.text == n.text
                    }).style({
                        opacity: lowOpacity
                    })
                }),
            this.cloud.events.subscribe("highlight",
                function(t, n) {
                    _.contains(e.inactiveTopics, n.text) || d3.selectAll("text").filter(function(e) {
                        return e.text == n.text
                    }).style({
                        opacity: highOpacity
                    })
                }),
            this.cloud.events.subscribe("selection.add",
                function(t, n) {
                    _.contains(e.inactiveTopics, n) || d3.selectAll("text").filter(function(e) {
                        return e.text == n
                    }).style({
                        opacity: medOpacity
                    }),
                        e.toggleSelection(n)
                }),
            this.cloud.events.subscribe("clickedOnBackground",
                function(t) {
                    e.clearSelection()
                })
    },
    ConceptCloud.prototype.clearSelection = function(e) {
        var t = this;
        this.selectedTopics = [],
            this.inactiveTopics = [],
            this.setTopicColors(),
        this.activeArticleIds.length > 0 && _.each(t.activeArticleIds,
            function(e) {
                t.eventBroker.publish("active.remove", e)
            }),
        e || this.eventBroker.publish("active.change"),
            this.activeArticleIds = []
    },
    ConceptCloud.prototype.toggleSelection = function(e) {
        if (self = this, this.cloud.selected.clear(), _.contains(this.inactiveTopics, e)) return this.clearSelection(!0),
            void this.toggleSelection(e); - 1 == this.selectedTopics.indexOf(e) ? this.selectedTopics.push(e) : this.selectedTopics = _.without(this.selectedTopics, e);
        if (_.isEmpty(this.selectedTopics)) _.each(self.activeArticleIds,
            function(e) {
                self.eventBroker.publish("active.remove", e)
            }),
            self.eventBroker.publish("active.change"),
            this.activeArticleIds = [],
            this.inactiveTopics = [];
        else {
            var t = {};
            _.each(this.links,
                function(e) {
                    if (target = self.nodes[e.target], target.type === self.displayedType) {
                        var n = target.name;
                        _.contains(self.selectedTopics, n) && (null == t[e.source] ? t[e.source] = {
                            article: e.source,
                            count: 1,
                            counted: [n]
                        }: _.contains(t[e.source].counted, n) || (t[e.source].count++, t[e.source].counted.push(n)))
                    }
                });
            var n = this.selectedTopics.length,
                i = this.activeArticleIds.slice();
            self.activeArticleIds = [],
                _.each(t,
                    function(e) {
                        e.count == n && self.activeArticleIds.push(e.article)
                    });
            var a = _.difference(i, self.activeArticleIds),
                o = _.difference(self.activeArticleIds, i);
            _.each(a,
                function(e) {
                    self.eventBroker.publish("active.remove", e)
                }),
                _.each(o,
                    function(e) {
                        self.eventBroker.publish("active.add", e)
                    }),
                self.eventBroker.publish("active.change")
        }
        this.setTopicColors()
    },
    ConceptCloud.prototype.setTopicColors = function() {
        var e = this;
        d3.selectAll(".cvvisualizationwordcloud text").style({
            fill: defaultColor
        });
        var t = [],
            n = [];
        if (!_.isEmpty(this.selectedTopics)) {
            var i = {};
            _.each(this.links,
                function(t) {
                    var n = e.nodes[t.target];
                    _.contains(e.activeArticleIds, t.source) && n.type === e.displayedType && (null == i[t.target] ? i[t.target] = {
                        concept: t.target,
                        count: 1
                    }: i[t.target].count++)
                });
            var a = e.activeArticleIds.length;
            _.each(i,
                function(i) {
                    var o = e.nodes[i.concept].name;
                    t.push(o),
                    i.count == a && n.push(o)
                }),
                this.inactiveTopics = _.difference(this.topics, t),
                //   console.log(t.length + " topics active"),
                d3.selectAll(".cvvisualizationwordcloud text").filter(function(t) {
                    return _.contains(e.inactiveTopics, t.text)
                }).style({
                    fill: inactiveTopicColor
                }),
                d3.selectAll(".cvvisualizationwordcloud text").filter(function(e) {
                    return _.contains(n, e.text)
                }).style({
                    fill: impliedTopicColor
                }),
                d3.selectAll(".cvvisualizationwordcloud text").filter(function(t) {
                    return _.contains(e.selectedTopics, t.text)
                }).style({
                    fill: selectedTopicColor
                })
        }
        var o = e.hoveredArticle;
        if (null == o) {
            var r = this.selectionManager.get();
            r.length > 0 && (o = this.nodes[Number(r[0])])
        }
        if (null != o && "article" === o.type) {
            var s = [];
            _.each(this.links,
                function(t) {
                    e.nodes[t.source] == o && e.nodes[t.target].type == e.displayedType && s.push(e.nodes[t.target].name)
                })
        }
        d3.selectAll("text").filter(function(e) {
            return _.contains(s, e.text)
        }).style({
            fill: associatedTopicColor
        })
    },
    ConceptCloud.prototype.resize = function() {
        null != this.tags && (this.clearSelection(), this.instantiateCloud())
    };
var Details = function(e, t) {
    var n = this;
    this.dbpedia = new DBPedia,
        this.divName = "#details-accordion",
        $("#entity-details").hide(),
        this.width = $(this.divName).width(),
        this.height = $(this.divName).height(),
        this.eventBroker = e,
        this.selectionManager = t;
    this.eventBroker.subscribe("selection.change",
        function(e) {
            var t = this.selectionManager.get(),
                i = null;
            if (t.length > 0 && (i = n.nodes[t[0]]), null == i || "article" === i.type) {
                if ($("#entity-image").hide(), $("#entity-type").hide(), $("#entity-name").hide(), $("#entity-description").hide(), $("#entity-details").hide(), $("#entity-image").attr("src", null), $("#entity-description").text(null), $("#entity-details").css("height", "0"), $("#accordion-container").css("height", "100%"), $("#details-accordion").css("height", "100%'"), null != i) {
                    var a = $("#article-" + i.id).index() / 2;
                    $(n.divName).accordion({
                        active: a
                    })
                }
            } else null != i.source ? n.dbpedia.getData(i.source,
                function(e) {
                    // var t = "images/entities/colorized/" + nodeType(i) + "_default.png",
                    //     n = e.summary.image || t,
                    //     a = e.summary.description;
                    // $("#entity-image").error(function() {
                    //     $("#entity-image").attr("src", t)
                    // }),
                    //     $("#entity-image").attr("src", n),
                    //     $("#entity-type").text(i.type),
                    //     $("#entity-name").text(i.name),
                    //     $("#entity-description").text(a),
                    //     $("#entity-description").append("<p></p>"),
                    //     null != a && a.length > 0 ? $("#entity-name").hide() : $("#entity-name").show(),
                    //     $("#entity-details").css("height", "50%"),
                    //     $("#accordion-container").css("height", "50%"),
                    //     $("#details-accordion").css("height", "50%'"),
                    //     null != n ? $("#entity-image").show("slow") : $("#entity-image").hide(),
                    //     $("#entity-type").show("slow"),
                    //     null != a ? $("#entity-description").show("slow") : $("#entity-description").hide(),
                    //     $("#entity-details").show("slow"),
                    //     $("#entity-details").scrollTop(0)
                },
                function(e, t, a) {
                    n.dbpediaFailure(i, t, a)
                }) : n.dbpediaFailure(i, "no dbpedia data", null),
                "person" === i.type ? $("#entity-details").css("border-left", "5px solid #82D1F5") : "company" === i.type ? $("#entity-details").css("border-left", "5px solid #00648D") : "organization" === i.type ? $("#entity-details").css("border-left", "5px solid #00B0DA") : "location" === i.type ? $("#entity-details").css("border-left", "5px solid #8CC63F") : "concept" === i.type ? $("#entity-details").css("border-left", "5px solid #9855D4") : "undefined" === i.type && $("#entity-details").css("border-left", "5px solid #868695")
        }),
        $("#find-field").autocomplete({
            source: function(e, t) {
                var i = e.term.toLowerCase(),
                    a = [],
                    o = null;
                _.each(n.nodes,
                    function(e) { - 1 != e.name.toLowerCase().indexOf(i) && (e.name.length === i.length ? o = {
                        label: e.name,
                        node: e
                    }: a.push({
                        label: e.name,
                        node: e
                    }))
                    }),
                    a = _.sortBy(a, "label"),
                null != o && a.unshift(o),
                    t(a)
            },
            select: function(e, t) {
                var i = t.item.node;
                "concept" != i.type ? n.selectionManager.set(i.id.toString()) : n.eventBroker.publish("concept.select", t.item.label)
            },
            minLength: 0,
            autoFocus: !0
        }).focus(function() {
            $(this).autocomplete("widget").is(":visible") || $(this).autocomplete("search", "")
        }).keydown(function(e) {
            13 === e.keyCode && $(this).trigger("submit")
        }).data("ui-autocomplete")._renderItem = function(e, t) {
            return $("<li>").attr("class", t.node.type + "-entity").append(t.label).appendTo(e)
        }
};
Details.prototype.dbpediaFailure = function(e, t, n) {
    // $("#entity-details").css("height", "50%"),
    //     $("#accordion-container").css("height", "50%"),
    //     $("#details-accordion").css("height", "50%'");
    // var i = "images/entities/colorized/" + nodeType(e) + "_default.png";
    // $("#entity-image").attr("src", i),
    //     $("#entity-type").text(e.type),
    //     $("#entity-name").text(e.name),
    //     $("#entity-name").show(),
    //     $("#entity-type").show(),
    //     $("#entity-image").show(),
    //     $("#entity-description").text(null != n ? "Normally there would be a text description here, but dBPedia, a service that is used to obtain a description and image for our entities, is not responding.  This won’t, however, hinder the functionality of the other application features, so please continue your investigation regardless.": ""),
    //     $("#entity-description").show("slow"),
    //     $("#entity-details").show("slow"),
    //     $("#entity-details").scrollTop(0)
},
    Details.prototype.data = function(e) {
        var t = this;
        this.nodes = e.nodes,
            this.links = e.links;
        var n, i, a = $(this.divName),
            o = 0;
        $("#entity-details").hide(),
            a.empty(),
            a.scrollTop(),
            a.accordion({
                collapsible: !0,
                active: !1,
                heightStyle: "content",
                icons: !1,
                activate: function(e, n) {
                    if (n.newHeader.length > 0) {
                        var i = n.newHeader[0].id.substring(8);
                        _.contains(t.selectionManager.get(), i) || t.selectionManager.set(i);
                        var a = $(t.divName).scrollTop() + n.newHeader.offset().top - $(t.divName).offset().top;
                        $(t.divName).animate({
                            scrollTop: a
                        })
                    }
                }
            }),
            _.each(this.nodes,
                function(e) {
                    if ("article" === e.type) {
                        o++,
                            n = $("<div/>").text(e.name).text(),
                            i = "" === e.summary ? "<i>no article preview available</i>": $("<div/>").text(e.summary).text();
                        var r = {};
                        _.each(t.links,
                            function(n) {
                                if (n.source == e.id) {
                                    var i = t.nodes[n.target];
                                    null == r[i.type] && (r[i.type] = []),
                                        r[i.type].push(i)
                                }
                            }),
                            a.append("<h3 class='entity-header' id='article-" + e.id + "'>" + n + "</h3>"),
                            a.append("<div class='entity-body'><span class = 'topic'>" + (void 0 !== e.category ? e.category: "none") + "</span><span class = 'timestamp'>" + (null !== e.date ? new Date(e.date).toString() : "") + "</span><p>" + i + "<span class='more-info'><a href='" + (void 0 !== e.source ? e.source: "#") + "' target='_blank'>full article...</a></span></p><span class='entities-linked'><span class='label'> companies linked: " + t.referenceString(r, "company") + "</span></span><span class='entities-linked'><span class='label'> organizations linked: " + t.referenceString(r, "organization") + "</span></span><span class='entities-linked'><span class = 'label'> people linked: " + t.referenceString(r, "person") + "</span></span><span class='entities-linked'><span class = 'label'> locations linked: " + t.referenceString(r, "location") + "</span></span><span class='entities-linked'><span class = 'label'> topics linked: " + t.referenceString(r, "concept") + "</span></span></div>")
                    }
                }),
            $(this.divName).accordion("refresh"),
            $(".person-entity").click(function() {
                var e = $(this).attr("id");
                if (null !== e) {
                    e = e.substr(7); {
                        t.nodes[e]
                    }
                    t.selectionManager.set(e)
                }
            }),
            $(".person-entity").dblclick(function() {
                newsQuery(this.textContent, "person")
            }),
            $(".company-entity").click(function() {
                var e = $(this).attr("id");
                null !== e && t.selectionManager.set(e.substr(8))
            }),
            $(".company-entity").dblclick(function() {
                newsQuery(this.textContent, "company")
            }),
            $(".organization-entity").click(function() {
                var e = $(this).attr("id");
                null !== e && t.selectionManager.set(e.substr(13))
            }),
            $(".organization-entity").dblclick(function() {
                newsQuery(this.textContent, "organization")
            }),
            $(".location-entity").click(function() {
                var e = $(this).attr("id");
                if (null !== e) {
                    e = e.substr(9); {
                        t.nodes[e]
                    }
                    t.selectionManager.set(e)
                }
            }),
            $(".location-entity").dblclick(function() {
                newsQuery(this.textContent, "")
            }),
            $(".concept-entity").click(function() {
                var e = $(this).attr("id");
                e = e.substr(8),
                null !== e && t.eventBroker.publish("concept.select", t.nodes[e].name)
            }),
            $(".concept-entity").dblclick(function() {
                newsQuery(this.textContent, "")
            }),
            $("#details-article-count").text(o)
    },
    Details.prototype.referenceString = function(e, t) {
        var n = e[t],
            i = "";
        return null == n || 0 === n.length ? i = "<span style='font-weight: normal; color: #777777;' class=" + t + "-entity>none</span>": _.each(n,
            function(e) {
                i.length > 0 && (i += ", "),
                    i += "location" === t ? "none" !== returnCountryCodeIfExists(e.name) || "undefined" != typeof e.geo ? "<span class='" + t + "-entity' id='" + t + "-" + e.id + "' >" + e.name + "</span>": "<span style='font-weight: normal' class='" + t + "-entity' id='" + t + "-" + e.id + "' >" + e.name + "</span>": "concept" === t ? "<span style='font-weight: normal' class='" + t + "-entity' id='" + t + "-" + e.id + "' >" + e.name + "</span>": "<span class='" + t + "-entity' id='" + t + "-" + e.id + "' >" + e.name + "</span>"
            }),
            i
    },
    $(function() {
        $("header").css("visibility", "visible"),
            $("#settings-area").css("visibility", "visible"),
            $("#service-logo-container a").attr("href", document.location.origin)
    });
var showingSettingsArea = !1;
$("#selected-entity-type").change(function() {
    "unconstrained" == $("#selected-entity-type").val() ? $("#selected-entity-type").css("color", "#666666") : "person" == $("#selected-entity-type").val() ? $("#selected-entity-type").css("color", "#82D1F5") : "company" == $("#selected-entity-type").val() ? $("#selected-entity-type").css("color", "#00648D") : "organization" == $("#selected-entity-type").val() ? $("#selected-entity-type").css("color", "#00B0DA") : "location" == $("#selected-entity-type").val() && $("#selected-entity-type").css("color", "#8CC63F")
}),
    $.widget("custom.catcomplete", $.ui.autocomplete, {
        _create: function() {
            this._super(),
                this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)")
        },
        _renderMenu: function(e, t) {
            var n = this,
                i = "";
            $.each(t,
                function(t, a) {
                    var o;
                    a.category != i && (e.append("<li class='ui-autocomplete-category'>" + a.category + "</li>"), i = a.category),
                        o = n._renderItemData(e, a),
                    a.category && o.attr("aria-label", a.category + " : " + a.label)
                })
        }
    });
var autocompleteSearchOpen = !1,
    autocompleteTargetOpen = !1;
$(function() {
    var e = [{
        label: "Current Events",
        category: "Category"
    },
        {
            label: "Art and Entertainment",
            category: "Category"
        },
        {
            label: "Business and Industrial",
            category: "Category"
        },
        {
            label: "Education",
            category: "Category"
        },
        {
            label: "Finance",
            category: "Category"
        },
        {
            label: "Health and Fitness",
            category: "Category"
        },
        {
            label: "Law, Government and Politics",
            category: "Category"
        },
        {
            label: "Religion and Spirituality",
            category: "Category"
        },
        {
            label: "Science",
            category: "Category"
        },
        {
            label: "Sports",
            category: "Category"
        },
        {
            label: "Technology and Computing",
            category: "Category"
        },
        {
            label: "Apple",
            category: "Companies"
        },
        {
            label: "Google",
            category: "Companies"
        },
        {
            label: "IBM",
            category: "Companies"
        },
        {
            label: "IRS",
            category: "Organizations"
        },
        {
            label: "NASA",
            category: "Organizations"
        },
        {
            label: "PETA",
            category: "Organizations"
        },
        {
            label: "Hillary Clinton",
            category: "People"
        },
        {
            label: "Barack Obama",
            category: "People"
        },
        {
            label: "Stephen Hawking",
            category: "People"
        },
        {
            label: "United States",
            category: "Locations"
        },
        {
            label: "Iran",
            category: "Locations"
        },
        {
            label: "London",
            category: "Locations"
        }];
    $("#search-field").catcomplete({
        delay: 0,
        minLength: 0,
        autoFocus: !0,
        source: e,
        open: function() {
            autocompleteSearchOpen = !0
        },
        close: function() {
            autocompleteSearchOpen = !1
        }
    }).on("focus",
        function() {
            $(this).keydown()
        });
    var t = [{
        label: "Art and Entertainment",
        category: "Category"
    },
        {
            label: "Business and Industrial",
            category: "Category"
        },
        {
            label: "Education",
            category: "Category"
        },
        {
            label: "Finance",
            category: "Category"
        },
        {
            label: "Health and Fitness",
            category: "Category"
        },
        {
            label: "Law, Government and Politics",
            category: "Category"
        },
        {
            label: "Religion and Spirituality",
            category: "Category"
        },
        {
            label: "Science",
            category: "Category"
        },
        {
            label: "Sports",
            category: "Category"
        },
        {
            label: "Technology and Computing",
            category: "Category"
        },
        {
            label: "Apple",
            category: "Companies"
        },
        {
            label: "Google",
            category: "Companies"
        },
        {
            label: "IBM",
            category: "Companies"
        },
        {
            label: "IRS",
            category: "Organizations"
        },
        {
            label: "NASA",
            category: "Organizations"
        },
        {
            label: "PETA",
            category: "Organizations"
        },
        {
            label: "Hillary Clinton",
            category: "People"
        },
        {
            label: "Barack Obama",
            category: "People"
        },
        {
            label: "Stephen Hawking",
            category: "People"
        },
        {
            label: "United States",
            category: "Locations"
        },
        {
            label: "Iran",
            category: "Locations"
        },
        {
            label: "London",
            category: "Locations"
        }];
    $("#target-field").catcomplete({
        delay: 0,
        minLength: 0,
        autoFocus: !0,
        source: t,
        open: function() {
            autocompleteTargetOpen = !0
        },
        close: function() {
            autocompleteTargetOpen = !1
        }
    }).on("focus",
        function() {
            $(this).keydown()
        })
}),
    $(document).ready(function() {
        function e(e) {
            "Apple" == $("#search-field").val() || "Google" == $("#search-field").val() || "IBM" == $("#search-field").val() ? ($('select[name^="selected-entity-type"] option:selected').attr("selected", null), $('select[name^="selected-entity-type"] option[value="company"]').attr("selected", "selected"), $("#selected-entity-type").css("color", "#00648D"), $("#settings-area").is(":hidden") && e && loadDataFromInvestigate()) : "IRS" == $("#search-field").val() || "NASA" == $("#search-field").val() || "PETA" == $("#search-field").val() ? ($('select[name^="selected-entity-type"] option:selected').attr("selected", null), $('select[name^="selected-entity-type"] option[value="organization"]').attr("selected", "selected"), $("#selected-entity-type").css("color", "#00B0DA"), $("#settings-area").is(":hidden") && e && loadDataFromInvestigate()) : "Hillary Clinton" == $("#search-field").val() || "Barack Obama" == $("#search-field").val() || "Stephen Hawking" == $("#search-field").val() ? ($('select[name^="selected-entity-type"] option:selected').attr("selected", null), $('select[name^="selected-entity-type"] option[value="person"]').attr("selected", "selected"), $("#selected-entity-type").css("color", "#82D1F5"), $("#settings-area").is(":hidden") && e && loadDataFromInvestigate()) : "United States" == $("#search-field").val() || "Iran" == $("#search-field").val() || "London" == $("#search-field").val() ? ($('select[name^="selected-entity-type"] option:selected').attr("selected", null), $('select[name^="selected-entity-type"] option[value="unconstrained"]').attr("selected", "selected"), $("#selected-entity-type").css("color", "#666666"), $("#settings-area").is(":hidden") && e && loadDataFromInvestigate()) : "Current Events" == $("#search-field").val() || "Art and Entertainment" == $("#search-field").val() || "Business and Industrial" == $("#search-field").val() || "Education" == $("#search-field").val() || "Finance" == $("#search-field").val() || "Health and Fitness" == $("#search-field").val() || "Law, Government and Politics" == $("#search-field").val() || "Religion and Spirituality" == $("#search-field").val() || "Science" == $("#search-field").val() || "Sports" == $("#search-field").val() || "Technology and Computing" == $("#search-field").val() ? (viewTutorial(!1), loadDataFromInvestigate(), displayCategory(!0)) : displayCategory(!1)
        }
        $("#search-field").focus(function() { ("Current Events" == $("#search-field").val() || "Art and Entertainment" == $("#search-field").val() || "Business and Industrial" == $("#search-field").val() || "Education" == $("#search-field").val() || "Finance" == $("#search-field").val() || "Health and Fitness" == $("#search-field").val() || "Law, Government and Politics" == $("#search-field").val() || "Religion and Spirituality" == $("#search-field").val() || "Religion and Spirituality" == $("#search-field").val() || "Science" == $("#search-field").val() || "Sports" == $("#search-field").val()) && $("#search-field").val(""),
            $("#search-field").css("background-color", "#FFFFFF"),
            $("#search-field").css("color", "#666666"),
            $("#search-field").css("width", "11vw"),
            $("#as").css("display", "inline"),
            $("#selected-entity-type").css("display", "inline"),
            $("#selected-entity-type").css("color", "#666666"),
            $("#search-button").css("display", "inline"),
            $("#settings-nav").css("display", "inline"),
            $('select[name^="selected-entity-type"] option:selected').attr("selected", null),
            $('select[name^="selected-entity-type"] option[value="unconstrained"]').attr("selected", "selected")
        }),
            $("#search-button").click(function() {
                landingAreaVisible && 2 == landingAreaNumSet ? (pr_clearScreen(), pr_spinner()) : viewLanding(!1),
                    $("#category-select").css("display", "none"),
                    $("header").css("height", "50px")
            }),
            $("#search-field").keyup(function() {
                if ($("#search-field").css("background-color", "#FFFFFF"), $("#search-field").css("color", "#666666"), $("#search-field").css("width", "11vw"), $("#as").css("display", "inline"), $("#selected-entity-type").css("display", "inline"), $("#selected-entity-type").css("color", "#666666"), $('select[name^="selected-entity-type"] option:selected').attr("selected", null), $('select[name^="selected-entity-type"] option[value="unconstrained"]').attr("selected", "selected"), $("#search-button").css("display", "inline"), $("#settings-nav").css("display", "inline"), !autocompleteSearchOpen) {
                    var t = event.keyCode ? event.keyCode: event.which;
                    "13" == t && (e(!0), viewTutorial(!1))
                }
            }),
            $(".ui-autocomplete").click(function() {
                e(!1)
            })
    }),
    $(document).ready(function() {
        function e(e) {
            "Apple" == $("#target-field").val() || "Google" == $("#target-field").val() || "IBM" == $("#target-field").val() ? ($('select[name^="target-entity-type"] option:selected').attr("selected", null), $('select[name^="target-entity-type"] option[value="company"]').attr("selected", "selected"), $("#target-entity-type").css("color", "#00648D")) : "IRS" == $("#target-field").val() || "NASA" == $("#target-field").val() || "PETA" == $("#target-field").val() ? ($('select[name^="target-entity-type"] option:selected').attr("selected", null), $('select[name^="target-entity-type"] option[value="organization"]').attr("selected", "selected"), $("#target-entity-type").css("color", "#00B0DA")) : "Hillary Clinton" == $("#target-field").val() || "Barack Obama" == $("#target-field").val() || "Stephen Hawking" == $("#target-field").val() ? ($('select[name^="target-entity-type"] option:selected').attr("selected", null), $('select[name^="target-entity-type"] option[value="person"]').attr("selected", "selected"), $("#target-entity-type").css("color", "#82D1F5")) : "United States" == $("#target-field").val() || "Iran" == $("#target-field").val() || "London" == $("#target-field").val() ? ($('select[name^="target-entity-type"] option:selected').attr("selected", null), $('select[name^="target-entity-type"] option[value="unconstrained"]').attr("selected", "selected"), $("#target-entity-type").css("color", "#666666")) : "Art and Entertainment" == $("#target-field").val() || "Business and Industrial" == $("#target-field").val() || "Education" == $("#target-field").val() || "Finance" == $("#target-field").val() || "Health and Fitness" == $("#target-field").val() || "Law, Government and Politics" == $("#target-field").val() || "Religion and Spirituality" == $("#target-field").val() || "Science" == $("#target-field").val() || "Sports" == $("#target-field").val() || "Technology and Computing" == $("#target-field").val() ? (viewTutorial(!1), displayTargetCategory(!0)) : ($('select[name^="target-entity-type"] option:selected').attr("selected", null), $('select[name^="target-entity-type"] option[value="unconstrained"]').attr("selected", "selected"), $("#target-entity-type").css("color", "#666666"), displayTargetCategory(!1))
        }
        $("#target-field").focus(function() { ("Art and Entertainment" == $("#target-field").val() || "Business and Industrial" == $("#target-field").val() || "Education" == $("#target-field").val() || "Finance" == $("#target-field").val() || "Health and Fitness" == $("#target-field").val() || "Law, Government and Politics" == $("#target-field").val() || "Religion and Spirituality" == $("#target-field").val() || "Religion and Spirituality" == $("#target-field").val() || "Science" == $("#target-field").val() || "Sports" == $("#target-field").val()) && $("#target-field").val(""),
            $("#target-field").css("background-color", "#FFFFFF"),
            $("#target-field").css("color", "#666666"),
            $("#target-field").css("width", "11vw"),
            $("#as-target").css("display", "inline"),
            $("#target-entity-type").css("display", "inline"),
            $("#target-entity-type").css("color", "#666666"),
            $('select[name^="target-entity-type"] option:selected').attr("selected", null),
            $('select[name^="target-entity-type"] option[value="unconstrained"]').attr("selected", "selected")
        }),
            $("#target-field").keyup(function() {
                if ($("#target-field").css("background-color", "#FFFFFF"), $("#target-field").css("color", "#666666"), $("#target-field").css("width", "11vw"), $("#as-target").css("display", "inline"), $("#target-entity-type").css("display", "inline"), $("#target-entity-type").css("color", "#666666"), $('select[name^="target-entity-type"] option:selected').attr("selected", null), $('select[name^="target-entity-type"] option[value="unconstrained"]').attr("selected", "selected"), !autocompleteTargetOpen) {
                    var t = event.keyCode ? event.keyCode: event.which;
                    "13" == t && (e(!0), viewTutorial(!1), viewLanding(!1))
                }
                displayTargetCategory(!1)
            }),
            $(".ui-autocomplete").click(function() {
                e(!1)
            })
    }),
    $(document).ready(function(e) {
        e("#visualizations-area").mousedown(function() {
            viewFindMenu(!1)
        }),
            e("#find-field").mousedown(function() {
                e("#find-field").val("")
            })
    });
var landingURL = "http://newsexplorer.stage1.mybluemix.net",
    landingAreasTotal = 2,
    landingAreaVisible = !1,
    breakingNewsDescription = "<span id='sub-area-description-header'>Trending & Breaking News</span><span class='sub-area-description-body-line'>This visualization area ranks the most frequently user queried <span class='company-entity-static'>companies</span>, <span class='organization-entity-static'>organizations</span>, <span class='person-entity-static'>people</span> and <span class='flintstone-entity-static'>connections</span> along the top,<span class='sub-area-description-body-line'>as well as adding <span class='concept-entity-static'>topics</span> along the bottom, that have the most <span class='flintstone-entity-static'>connections</span> to articles by <span class='category-link'>category</span>.</span><span class='sub-area-description-body-line'>Click on any of these elements to visualize a query of them in News Explorer.</span>",
    pantaRheiDescription = "<span id='sub-area-description-header'>Panta Rhei &mdash; River of News</span><span class='sub-area-description-body-line'>This visualization area displays <span style='color: #00B4A0;'>article  titles</span> from current events in a way where users can quickly scan them.</span><span class='sub-area-description-body-line'>The larger the <span style='color: #00B4A0; font-size: 1.5vw;'>title</span>, the higher the article prominence.  The brighter the <span style='color: #6EEDD8;'>title</span>, the more positive the article sentiment. </span><span class='sub-area-description-body-line'>Click on a <span style='color: #41D6C3;'>title</span> to visualize its relationship to current events in News Explorer.</span>",
    currentDescription = null,
    descriptionTimer = null;
$(function() {
    $("#landing-area").css("visibility", "visible"),

        $("#landing-area").css({
            height: $(window).height() - $("header").height() + "px"
        }),
        $("#landing-area").css({
            //设置高度
            top: $("header").height() + "px"
        }),
        $("#landing-area").css({
            left: "0px"
        }),
        $("#landing-area").css({
            width: $(window).width() * landingAreasTotal + "px"
        })
}),
    $(window).resize(function() {
        if ($("#landing-area").css({
                height: $(window).height() - $("header").height() + "px"
            }), $("#landing-area").css({
                top: $("header").height() + "px"
            }), $("#landing-area").css({
                width: $(window).width() * landingAreasTotal + "px"
            }), 1 == landingAreaNumSet) $("html, body").scrollLeft(0);
        else if (2 == landingAreaNumSet) {
            var e = .5 * $("#landing-area").width();
            $("html, body").scrollLeft(e)
        }
    });
var landingAreaNumSet = 1;
$("body").mousemove(function(e) {
    $(".landing-nav-triangle").css({
        display: "inline"
    }),
        $(".landing-nav-triangle").delay(5e3).fadeOut(1e3,
            function() {
                $(".landing-nav-triangle").css({
                    display: "done"
                })
            })
}),
    $("#landing-sub-area-one-icon-active").mouseenter(function() {
        1 == landingAreaNumSet && showLandingAreaDescription(breakingNewsDescription)
    }),
    $("#landing-sub-area-one-icon-active").mouseleave(function() {
        1 == landingAreaNumSet && hideLandingAreaDescription()
    }),
    $("#landing-sub-area-two-icon-inactive").mousedown(function() {
        1 == landingAreaNumSet && scrollLanding("right"),
            hideLandingAreaDescription(5e3)
    }),
    $("#landing-sub-area-two-icon-active").mouseenter(function() {
        2 == landingAreaNumSet && showLandingAreaDescription(pantaRheiDescription)
    }),
    $("#landing-sub-area-two-icon-active").mouseleave(function() {
        2 == landingAreaNumSet && hideLandingAreaDescription()
    }),
    $("#landing-sub-area-one-icon-inactive").mousedown(function() {
        2 == landingAreaNumSet && scrollLanding("left"),
            hideLandingAreaDescription(5e3)
    }),
    $("#landing-sub-area-one-icon-active").on("touchstart",
        function(e) {
            showLandingAreaDescription(breakingNewsDescription),
                hideLandingAreaDescription(5e3),
                e.preventDefault()
        }),
    $("#landing-sub-area-one-icon-active").on("touchend",
        function(e) {
            hideLandingAreaDescription(),
                e.preventDefault()
        }),
    $("#landing-sub-area-one-icon-inactive").on("touchstart",
        function(e) {
            2 == landingAreaNumSet && scrollLanding("left"),
                showLandingAreaDescription(breakingNewsDescription),
                hideLandingAreaDescription(5e3),
                e.preventDefault()
        }),
    $("#landing-sub-area-one-icon-inactive").on("touchend",
        function(e) {
            hideLandingAreaDescription(),
                e.preventDefault()
        }),
    $("#landing-sub-area-two-icon-active").on("touchstart",
        function(e) {
            2 == landingAreaNumSet && (showLandingAreaDescription(pantaRheiDescription), hideLandingAreaDescription(5e3)),
                e.preventDefault()
        }),
    $("#landing-sub-area-two-icon-active").on("touchend",
        function() {
            hideLandingAreaDescription(),
                event.preventDefault()
        }),
    $("#landing-sub-area-two-icon-inactive").on("touchstart",
        function(e) {
            1 == landingAreaNumSet && scrollLanding("right"),
                showLandingAreaDescription(pantaRheiDescription),
                hideLandingAreaDescription(5e3),
                e.preventDefault()
        }),
    $("#landing-sub-area-two-icon-inactive").on("touchend",
        function() {
            hideLandingAreaDescription(),
                event.preventDefault()
        });
var beachLine, spinner, pr_titles = [],
    pr_fontColors = ["#005448", "#006D5D", "#008571", "#00B4A0", "#41D6C3", "#6EEDD8", "#A7FAE6"],
    pr_fontFamily = "'Merriweather', serif",
    pr_tickerWidth = 0,
    pr_tickerHeight = 0,
    pr_padding = 10,
    pr_tickerTop = pr_padding,
    pr_tickerBottom,
    pr_numStreams = 1,
    pr_screenSplit = 0,
    pr_splitSize = 20,
    pr_scanSpeed = .0259,
    pr_activeTicks = [],
    pr_minFontSize = 14,
    pr_maxFontSize = 60,
    pr_fontMap = [],
    pr_xBuffer = 40,
    pr_yBuffer = 10,
    pr_currWeek,
    pr_epochWeek = 6048e5,
    pr_tickCounter = 0,
    pr_loopCounter = 0,
    pr_titleCounters = [0, 0],
    pr_trimWait = 300,
    pr_trimTimer,
    pr_trimNeeded = !1,
    pr_currView = !1,
    pr_toggleCount = 0,
    pr_launching = !1,
    pr_newsData = null,
    pr_params = null,
    pr_initView = !0;
$(function() {
    pr_initialize()
}),
    !
        function(e, t) {
            "object" == typeof module && module.exports ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : e.Spinner = t()
        } (this,
            function() {
                "use strict";
                function e(e, t) {
                    var n, i = document.createElement(e || "div");
                    for (n in t) i[n] = t[n];
                    return i
                }
                function t(e) {
                    for (var t = 1,
                             n = arguments.length; n > t; t++) e.appendChild(arguments[t]);
                    return e
                }
                function n(e, t, n, i) {
                    var a = ["opacity", t, ~~ (100 * e), n, i].join("-"),
                        o = .01 + n / i * 100,
                        r = Math.max(1 - (1 - e) / t * (100 - o), e),
                        s = c.substring(0, c.indexOf("Animation")).toLowerCase(),
                        l = s && "-" + s + "-" || "";
                    return p[a] || (u.insertRule("@" + l + "keyframes " + a + "{0%{opacity:" + r + "}" + o + "%{opacity:" + e + "}" + (o + .01) + "%{opacity:1}" + (o + t) % 100 + "%{opacity:" + e + "}100%{opacity:" + r + "}}", u.cssRules.length), p[a] = 1),
                        a
                }
                function i(e, t) {
                    var n, i, a = e.style;
                    if (t = t.charAt(0).toUpperCase() + t.slice(1), void 0 !== a[t]) return t;
                    for (i = 0; i < d.length; i++) if (n = d[i] + t, void 0 !== a[n]) return n
                }
                function a(e, t) {
                    for (var n in t) e.style[i(e, n) || n] = t[n];
                    return e
                }
                function o(e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var n = arguments[t];
                        for (var i in n) void 0 === e[i] && (e[i] = n[i])
                    }
                    return e
                }
                function r(e, t) {
                    return "string" == typeof e ? e: e[t % e.length]
                }
                function s(e) {
                    this.opts = o(e || {},
                        s.defaults, h)
                }
                function l() {
                    function n(t, n) {
                        return e("<" + t + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', n)
                    }
                    u.addRule(".spin-vml", "behavior:url(#default#VML)"),
                        s.prototype.lines = function(e, i) {
                            function o() {
                                return a(n("group", {
                                    coordsize: u + " " + u,
                                    coordorigin: -c + " " + -c
                                }), {
                                    width: u,
                                    height: u
                                })
                            }
                            function s(e, s, l) {
                                t(p, t(a(o(), {
                                    rotation: 360 / i.lines * e + "deg",
                                    left: ~~s
                                }), t(a(n("roundrect", {
                                    arcsize: i.corners
                                }), {
                                    width: c,
                                    height: i.scale * i.width,
                                    left: i.scale * i.radius,
                                    top: -i.scale * i.width >> 1,
                                    filter: l
                                }), n("fill", {
                                    color: r(i.color, e),
                                    opacity: i.opacity
                                }), n("stroke", {
                                    opacity: 0
                                }))))
                            }
                            var l, c = i.scale * (i.length + i.width),
                                u = 2 * i.scale * c,
                                d = -(i.width + i.length) * i.scale * 2 + "px",
                                p = a(o(), {
                                    position: "absolute",
                                    top: d,
                                    left: d
                                });
                            if (i.shadow) for (l = 1; l <= i.lines; l++) s(l, -2, "progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");
                            for (l = 1; l <= i.lines; l++) s(l);
                            return t(e, p)
                        },
                        s.prototype.opacity = function(e, t, n, i) {
                            var a = e.firstChild;
                            i = i.shadow && i.lines || 0,
                            a && t + i < a.childNodes.length && (a = a.childNodes[t + i], a = a && a.firstChild, a = a && a.firstChild, a && (a.opacity = n))
                        }
                }
                var c, u, d = ["webkit", "Moz", "ms", "O"],
                    p = {},
                    h = {
                        lines: 12,
                        length: 12,
                        width: 5,
                        radius: 30,
                        scale: 1,
                        corners: 1,
                        color: "#fff",
                        opacity: .25,
                        rotate: 0,
                        direction: 1,
                        speed: 1,
                        trail: 100,
                        fps: 20,
                        zIndex: 2e9,
                        className: "spinner",
                        top: "50%",
                        left: "50%",
                        shadow: !1,
                        hwaccel: !1,
                        position: "absolute"
                    };
                if (s.defaults = {},
                        o(s.prototype, {
                            spin: function(t) {
                                this.stop();
                                var n = this,
                                    i = n.opts,
                                    o = n.el = e(null, {
                                        className: i.className
                                    });
                                if (a(o, {
                                        position: i.position,
                                        width: 0,
                                        zIndex: i.zIndex,
                                        left: i.left,
                                        top: i.top
                                    }), t && t.insertBefore(o, t.firstChild || null), o.setAttribute("role", "progressbar"), n.lines(o, n.opts), !c) {
                                    var r, s = 0,
                                        l = (i.lines - 1) * (1 - i.direction) / 2,
                                        u = i.fps,
                                        d = u / i.speed,
                                        p = (1 - i.opacity) / (d * i.trail / 100),
                                        h = d / i.lines; !
                                        function g() {
                                            s++;
                                            for (var e = 0; e < i.lines; e++) r = Math.max(1 - (s + (i.lines - e) * h) % d * p, i.opacity),
                                                n.opacity(o, e * i.direction + l, r, i);
                                            n.timeout = n.el && setTimeout(g, ~~ (1e3 / u))
                                        } ()
                                }
                                return n
                            },
                            stop: function() {
                                var e = this.el;
                                return e && (clearTimeout(this.timeout), e.parentNode && e.parentNode.removeChild(e), this.el = void 0),
                                    this
                            },
                            lines: function(i, o) {
                                function s(t, n) {
                                    return a(e(), {
                                        position: "absolute",
                                        width: o.scale * (o.length + o.width) + "px",
                                        height: o.scale * o.width + "px",
                                        background: t,
                                        boxShadow: n,
                                        transformOrigin: "left",
                                        transform: "rotate(" + ~~ (360 / o.lines * u + o.rotate) + "deg) translate(" + o.scale * o.radius + "px,0)",
                                        borderRadius: (o.corners * o.scale * o.width >> 1) + "px"
                                    })
                                }
                                for (var l, u = 0,
                                         d = (o.lines - 1) * (1 - o.direction) / 2; u < o.lines; u++) l = a(e(), {
                                    position: "absolute",
                                    top: 1 + ~ (o.scale * o.width / 2) + "px",
                                    transform: o.hwaccel ? "translate3d(0,0,0)": "",
                                    opacity: o.opacity,
                                    animation: c && n(o.opacity, o.trail, d + u * o.direction, o.lines) + " " + 1 / o.speed + "s linear infinite"
                                }),
                                o.shadow && t(l, a(s("#000", "0 0 4px #000"), {
                                    top: "2px"
                                })),
                                    t(i, t(l, s(r(o.color, u), "0 0 1px rgba(0,0,0,.1)")));
                                return i
                            },
                            opacity: function(e, t, n) {
                                t < e.childNodes.length && (e.childNodes[t].style.opacity = n)
                            }
                        }), "undefined" != typeof document) {
                    u = function() {
                        var n = e("style", {
                            type: "text/css"
                        });
                        return t(document.getElementsByTagName("head")[0], n),
                        n.sheet || n.styleSheet
                    } ();
                    var g = a(e("group"), {
                        behavior: "url(#default#VML)"
                    }); ! i(g, "transform") && g.adj ? l() : c = i(g, "animation")
                }
                return s
            }),
    pr_spinner(),
    $(function() {
        adjustLanding()
    }),
    $(window).resize(function() {
        adjustLanding(),
            populateBreakingNews()
    });
var world_map, selectedCountryCode = "",
    selectedNonCountryGeoLocation = "",
    associatedLocations = [],
    includedCountries,
    possibleCountries = [],
    nonCountryGeoLocations = [],
    nonCountryGeoLocationsBubbleData = [],
    showingLocationList = !1,
    Locations = function(e, t) {
        var n = this;
        this.divName = "#location-globe",
            this.width = $(this.divName).width(),
            this.height = $(this.divName).height(),
            this.eventBroker = e,
            this.selectionManager = t,
            this.eventBroker.subscribe("selection.add",
                function(e, t) {
                    var i = n.nodes[t];
                    selectedNonGeoLocation = "",
                        associatedLocations = [],
                        "location" === i.type ? (selectedCountryCode = returnCountryCodeIfExists(i.name), "none" !== selectedCountryCode ? n.updateMap() : (selectedCountryCode = "none", "undefined" != typeof i.geo && (selectedNonCountryGeoLocation = i.name), n.updateMap())) : "article" === i.type && (associatedLocations = [], _.each(n.links,
                            function(e) {
                                var t = n.nodes[e.target];
                                e.source === i.id && "location" === t.type && associatedLocations.push(t.name)
                            }), n.updateMap())
                }),
            this.eventBroker.subscribe("selection.remove",
                function(e, t) {
                    selectedNonCountryGeoLocation = "",
                        associatedLocations = [],
                        n.updateMap()
                }),
            resetLocationRadioButtons()
    };
Locations.prototype.data = function(e) {
    var t = this;
    this.nodes = e.nodes,
        this.links = e.links;
    $(this.divName);
    $("#location-globe").empty(),
        world_map = {},
        $("#location-globe").empty();
    world_map = new Datamap({
        element: document.getElementById("location-globe"),
        scope: "world",
        responsive: !0,
        aspectRatio: .3,
        height: this.height,
        width: this.width,
        fills: {
            inactiveFill: "#3C4646",
            activeFill: "#8CC63F",
            includedFill: "#B4E051",
            associatedFill: "#2D660A",
            defaultFill: "#3C4646"
        },
        setProjection: function(e) {
            var n = d3.geo.equirectangular().center([0, 0]).rotate([0, 0]).scale(.16 * t.width).translate([e.offsetWidth / 2, e.offsetHeight / 1.75]),
                i = d3.geo.path().projection(n);
            return {
                path: i,
                projection: n
            }
        },
        geographyConfig: {
            hideAntarctica: !0,
            borderWidth: .5,
            highlightBorderWidth: 1,
            popupTemplate: function(e, t) {
                return '<div class="hoverinfo"><strong>' + e.properties.name + "</strong></div>"
            },
            popupOnHover: !0,
            highlightFillColor: "#B4E051",
            highlightBorderColor: "#FFFFFF",
            highlightFillOpacity: .85
        },
        done: function(e) {
            function n() {
                e.svg.selectAll("g").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")")
            }
            e.svg.selectAll(".datamaps-subunit").on("click",
                function(e) {
                    var n = e.properties.name;
                    t.selectLocation(n)
                }).on("dblclick",
                function(e) {
                    newsQuery(e.properties.name, "")
                }),
                e.svg.call(d3.behavior.zoom().on("zoom", n))
        }
    }),
        $("#location-globe").append("<div id='location-entities'></div>"),
        showLocationList(showingLocationList),
        $("#location-entities").append("<ul id='locations-list'></ul>"),
        $("#zoom-button-in-map").on("click",
            function(e) {
                e.stopPropagation()
            }),
        $("#zoom-button-out-map").on("click",
            function(e) {
                e.stopPropagation()
            }),
        expandPossibleCountries();
    var n = [],
        i = 0;
    $("#locations-list").empty();
    for (var a = 0; a < this.nodes.length; a++) {
        var o = this.nodes[a];
        "location" === o.type && ($("#locations-list").append("none" !== returnCountryCodeIfExists(o.name) || "undefined" != typeof o.geo ? "<li><span class='maplocation-entity' style='font-weight: bold' id='maplocation-" + o.id + "''>" + o.name + "</span></li>": "<li><span class='maplocation-entity' id='maplocation-" + o.id + "''>" + o.name + "</span></li>"), n.push(o), i++)
    }
    $("#total-locations").empty(),
        $("#total-locations").append(i),
        includedCountries = [];
    for (nonCountryLocations = n, a = 0, j = possibleCountries.length; a < j; a++) for (var r = 0; r < n.length; r++) n[r].name === possibleCountries[a].properties.name && (includedCountries.push(possibleCountries[a].id), nonCountryLocations.splice(r, 1));
    for (nonCountryGeoLocations = [], a = 0; a < nonCountryLocations.length; a++) null != nonCountryLocations[a].geo && "" != nonCountryLocations[a].geo && ("0" != getLatitude(nonCountryLocations[a].geo) && "0" != getLongitude(nonCountryLocations[a].geo) || " " != getLatitude(nonCountryLocations[a].geo) || " " != getLongitude(nonCountryLocations[a].geo) || "" !== getLatitude(nonCountryLocations[a].geo) || "" !== getLongitude(nonCountryLocations[a].geo) || !isNaN(getLongitude(nonCountryLocations[a].geo)) || !isNaN(getLatitude(nonCountryLocations[a].geo))) && nonCountryGeoLocations.push(nonCountryLocations[a]);
    this.updateMap(),
        _.each(this.nodes,
            function(e) {
                "article" === e.type && (references = {
                    location: []
                },
                    _.each(t.links,
                        function(i) {
                            if (i.source == e.id) for (var a = t.nodes[i.target], o = 0; o < n.length; o++) a.name === n[o].name && "location" === a.type && references[a.type].push(a)
                        }))
            }),
        $(".maplocation-entity").click(function() {
            var e = $(this).attr("id");
            null != e && (e = e.substr(12), t.selectionManager.set(e))
        }),
        $(".maplocation-entity").dblclick(function() {
            newsQuery(this.textContent, "")
        })
},
    Locations.prototype.selectLocation = function(e) {
        e = e.toLowerCase(),
        ("united states of america" === e || "us" === e || "u.s." === e || "u.s.a." === e || "usa" === e) && (e = "united states");
        var t = _.find(this.nodes,
            function(t) {
                return "location" === t.type && t.name.toLowerCase() === e
            });
        null != t && this.selectionManager.set(t.id.toString())
    },
    Locations.prototype.updateMap = function() {
        var e = this;
        world_map.updateChoropleth({
            AFG: obtainCountryActivityState("AFG"),
            AGO: obtainCountryActivityState("AGO"),
            ALB: obtainCountryActivityState("ALB"),
            ARE: obtainCountryActivityState("ARE"),
            ARG: obtainCountryActivityState("ARG"),
            ARM: obtainCountryActivityState("ARM"),
            ATA: obtainCountryActivityState("ATA"),
            ATF: obtainCountryActivityState("ATF"),
            AUS: obtainCountryActivityState("AUS"),
            AUT: obtainCountryActivityState("AUT"),
            AZE: obtainCountryActivityState("AZE"),
            BDI: obtainCountryActivityState("BDI"),
            BEL: obtainCountryActivityState("BEL"),
            BEN: obtainCountryActivityState("BEN"),
            BFA: obtainCountryActivityState("BFA"),
            BGD: obtainCountryActivityState("BGD"),
            BGR: obtainCountryActivityState("BGR"),
            BHS: obtainCountryActivityState("BHS"),
            BIH: obtainCountryActivityState("BIH"),
            BLR: obtainCountryActivityState("BLR"),
            BLZ: obtainCountryActivityState("BLZ"),
            BOL: obtainCountryActivityState("BOL"),
            BRA: obtainCountryActivityState("BRA"),
            BRN: obtainCountryActivityState("BRN"),
            BTN: obtainCountryActivityState("BTN"),
            BWA: obtainCountryActivityState("BWA"),
            CAF: obtainCountryActivityState("CAF"),
            CAN: obtainCountryActivityState("CAN"),
            CHE: obtainCountryActivityState("CHE"),
            CHL: obtainCountryActivityState("CHL"),
            CHN: obtainCountryActivityState("CHN"),
            CIV: obtainCountryActivityState("CIV"),
            CMR: obtainCountryActivityState("CMR"),
            COD: obtainCountryActivityState("COD"),
            COG: obtainCountryActivityState("COG"),
            COL: obtainCountryActivityState("COL"),
            CRI: obtainCountryActivityState("CRI"),
            CUB: obtainCountryActivityState("CUB"),
            CYP: obtainCountryActivityState("CYP"),
            CZE: obtainCountryActivityState("CZE"),
            DEU: obtainCountryActivityState("DEU"),
            DJI: obtainCountryActivityState("DJI"),
            DNK: obtainCountryActivityState("DNK"),
            DOM: obtainCountryActivityState("DOM"),
            DZA: obtainCountryActivityState("DZA"),
            ECU: obtainCountryActivityState("ECU"),
            EGY: obtainCountryActivityState("EGY"),
            ERI: obtainCountryActivityState("ERI"),
            ESP: obtainCountryActivityState("ESP"),
            EST: obtainCountryActivityState("EST"),
            ETH: obtainCountryActivityState("ETH"),
            FIN: obtainCountryActivityState("FIN"),
            FJI: obtainCountryActivityState("FJI"),
            FLK: obtainCountryActivityState("FLK"),
            FRA: obtainCountryActivityState("FRA"),
            GUF: obtainCountryActivityState("GUF"),
            GAB: obtainCountryActivityState("GAB"),
            GBR: obtainCountryActivityState("GBR"),
            GEO: obtainCountryActivityState("GEO"),
            GHA: obtainCountryActivityState("GHA"),
            GIN: obtainCountryActivityState("GIN"),
            GMB: obtainCountryActivityState("GMB"),
            GNB: obtainCountryActivityState("GNB"),
            GNQ: obtainCountryActivityState("GNQ"),
            GRC: obtainCountryActivityState("GRC"),
            GRL: obtainCountryActivityState("GRL"),
            GTM: obtainCountryActivityState("GTM"),
            GUY: obtainCountryActivityState("GUY"),
            HND: obtainCountryActivityState("HND"),
            HRV: obtainCountryActivityState("HRV"),
            HTI: obtainCountryActivityState("HTI"),
            HUN: obtainCountryActivityState("HUN"),
            IDN: obtainCountryActivityState("IDN"),
            IND: obtainCountryActivityState("IDN"),
            IRL: obtainCountryActivityState("IRL"),
            IRN: obtainCountryActivityState("IRN"),
            IRQ: obtainCountryActivityState("IRQ"),
            ISL: obtainCountryActivityState("ISL"),
            ISR: obtainCountryActivityState("ISR"),
            ITA: obtainCountryActivityState("ITA"),
            JAM: obtainCountryActivityState("JAM"),
            JOR: obtainCountryActivityState("JOR"),
            JPN: obtainCountryActivityState("JPN"),
            KAZ: obtainCountryActivityState("KAZ"),
            KEN: obtainCountryActivityState("KEN"),
            KGZ: obtainCountryActivityState("KGZ"),
            KHM: obtainCountryActivityState("KHM"),
            KOR: obtainCountryActivityState("KOR"),
            KWT: obtainCountryActivityState("KWT"),
            LAO: obtainCountryActivityState("LAO"),
            LBN: obtainCountryActivityState("LBN"),
            LBR: obtainCountryActivityState("LBR"),
            LBY: obtainCountryActivityState("LBY"),
            LKA: obtainCountryActivityState("LKA"),
            LSO: obtainCountryActivityState("LSO"),
            LTU: obtainCountryActivityState("LTU"),
            LUX: obtainCountryActivityState("LUX"),
            LVA: obtainCountryActivityState("LVA"),
            MAR: obtainCountryActivityState("MAR"),
            MDA: obtainCountryActivityState("MDA"),
            MDG: obtainCountryActivityState("MDG"),
            MEX: obtainCountryActivityState("MEX"),
            MKD: obtainCountryActivityState("MKD"),
            MLI: obtainCountryActivityState("MLI"),
            MMR: obtainCountryActivityState("MMR"),
            MNE: obtainCountryActivityState("MNE"),
            MNG: obtainCountryActivityState("MNG"),
            MOZ: obtainCountryActivityState("MOZ"),
            MRT: obtainCountryActivityState("MRT"),
            MWI: obtainCountryActivityState("MWI"),
            MYS: obtainCountryActivityState("MYS"),
            NAM: obtainCountryActivityState("NAM"),
            NCL: obtainCountryActivityState("NCL"),
            NER: obtainCountryActivityState("NER"),
            NGA: obtainCountryActivityState("NGA"),
            NIC: obtainCountryActivityState("NIC"),
            NLD: obtainCountryActivityState("NLD"),
            NOR: obtainCountryActivityState("NOR"),
            NPL: obtainCountryActivityState("NPL"),
            NZL: obtainCountryActivityState("NZL"),
            OMN: obtainCountryActivityState("OMN"),
            PAK: obtainCountryActivityState("PAK"),
            PAN: obtainCountryActivityState("PAN"),
            PER: obtainCountryActivityState("PER"),
            PHL: obtainCountryActivityState("PHL"),
            PNG: obtainCountryActivityState("PNG"),
            POL: obtainCountryActivityState("POL"),
            PRI: obtainCountryActivityState("PRI"),
            PRK: obtainCountryActivityState("PRK"),
            PRT: obtainCountryActivityState("PRT"),
            PRY: obtainCountryActivityState("PRY"),
            QAT: obtainCountryActivityState("QAT"),
            ROU: obtainCountryActivityState("ROU"),
            RUS: obtainCountryActivityState("RUS"),
            RWA: obtainCountryActivityState("RWA"),
            ESH: obtainCountryActivityState("ESH"),
            SAU: obtainCountryActivityState("SAU"),
            SDN: obtainCountryActivityState("SDN"),
            SSD: obtainCountryActivityState("SSD"),
            SEN: obtainCountryActivityState("SEN"),
            SLB: obtainCountryActivityState("SLB"),
            SLE: obtainCountryActivityState("SLE"),
            SLV: obtainCountryActivityState("SLV"),
            SOM: obtainCountryActivityState("SOM"),
            SRB: obtainCountryActivityState("SRB"),
            SUR: obtainCountryActivityState("SUR"),
            SVK: obtainCountryActivityState("SVK"),
            SVN: obtainCountryActivityState("SVN"),
            SWE: obtainCountryActivityState("SWE"),
            SWZ: obtainCountryActivityState("SWZ"),
            SYR: obtainCountryActivityState("SYR"),
            TCD: obtainCountryActivityState("TCD"),
            TGO: obtainCountryActivityState("TGO"),
            THA: obtainCountryActivityState("THA"),
            TJK: obtainCountryActivityState("TJK"),
            TKM: obtainCountryActivityState("TKM"),
            TLS: obtainCountryActivityState("TLS"),
            TTO: obtainCountryActivityState("TTO"),
            TUN: obtainCountryActivityState("TUN"),
            TUR: obtainCountryActivityState("TUR"),
            TWN: obtainCountryActivityState("TWN"),
            TZA: obtainCountryActivityState("TZA"),
            UGA: obtainCountryActivityState("UGA"),
            UKR: obtainCountryActivityState("UKR"),
            URY: obtainCountryActivityState("URY"),
            USA: obtainCountryActivityState("USA"),
            UZB: obtainCountryActivityState("UZB"),
            VEN: obtainCountryActivityState("VEN"),
            VNM: obtainCountryActivityState("VMN"),
            VUT: obtainCountryActivityState("VUT"),
            PSE: obtainCountryActivityState("PSE"),
            YEM: obtainCountryActivityState("YEM"),
            ZAF: obtainCountryActivityState("ZAF"),
            ZMB: obtainCountryActivityState("ZMB"),
            ZWE: obtainCountryActivityState("ZWE")
        }),
            nonCountryGeoLocationsBubbleData = [];
        for (var t = 0; t < nonCountryGeoLocations.length; t++) {
            var n = "activeFill";
            _.contains(associatedLocations, nonCountryGeoLocations[t].name) && (n = "associatedFill"),
            nonCountryGeoLocations[t].name === selectedNonCountryGeoLocation && (n = "includedFill"),
                nonCountryGeoLocationsBubbleData.push({
                    name: nonCountryGeoLocations[t].name,
                    radius: 4,
                    fillKey: n,
                    latitude: getLatitude(nonCountryGeoLocations[t].geo),
                    longitude: getLongitude(nonCountryGeoLocations[t].geo)
                })
        }
        world_map.bubbles(nonCountryGeoLocationsBubbleData, {
            borderWidth: .5,
            highlightBorderWidth: 1,
            popupTemplate: function(e, t) {
                return "<div class='hoverinfo'>" + t.name + "</div>"
            },
            popupOnHover: !0,
            highlightFillColor: "#B4E051",
            highlightBorderColor: "#FFFFFF",
            highlightFillOpacity: .85
        }),
            world_map.svg.selectAll(".datamaps-bubble").on("click",
                function() {
                    var t = JSON.parse(this.getAttribute("data-info")).name;
                    e.selectLocation(t)
                }).on("dblclick",
                function(e) {
                    var t = JSON.parse(this.getAttribute("data-info")).name;
                    newsQuery(t, "")
                })
    },
    Locations.prototype.resize = function() {
        this.width = $(this.divName).width(),
            this.height = $(this.divName).height(),
        null != world_map && world_map.resize()
    };
var highOpacity = 1,
    medOpacity = .9,
    lowOpacity = .8,
    maxScale = 1,
    minScale = .04,
    initialScale = .12,
    labelScale = .6,
    useWgl = !1,
    imageTypes = ["article", "person", "company", "organization", "location", "concept"],
    Network = function(e, t, n) {
        var i = this;
        this.divName = e,
            this.width = $(this.divName).width(),
            this.height = $(this.divName).height(),
            this.originX = this.width / 2,
            this.originY = this.height / 2,
            this.scale = initialScale,
            this.color = d3.scale.category20(),
            this.lastMouse = null,
            this.mouseIsDown = !1,
            this.eventBroker = t,
            this.selectionManager = n,
            this.activeNodes = [],
            this.visibleNodeTypes = ["article", "company", "organization", "person"],
            this.container = $(this.divName),
            this.recenter = !1,
            this.wglLoggedIn = !1;
        var a = function() {};
        a.prototype.onLogin = function() {
            //  console.log("logged in after " + ((new Date).getTime() - i.wglStartTime) + " msec"),
            i.wglLoggedIn = !0
        },
            a.prototype.onNodePositions = function(e) {
                //     console.log("got some positions back!")
            },
            a.prototype.onGraphs = function(e) {
                _.each(e,
                    function(e) {
                        "News-Explorer" == e.name
                    })
            },
            a.prototype.onGraph = function(e) {
                if (i.layoutRequested && "News-Explorer" === e.name) {
                    var t = Number.MAX_VALUE,
                        n = Number.MAX_VALUE,
                        a = -Number.MAX_VALUE,
                        o = -Number.MAX_VALUE;
                    if (_.each(e.nodes,
                            function(e) {
                                t = Math.min(t, e.x),
                                    n = Math.min(n, e.y),
                                    a = Math.max(a, e.x),
                                    o = Math.max(o, e.y)
                            }), console.log("(" + t + ".." + a + ", " + n + ".." + o + ")"), 0 != t || 0 != a || 0 != n || 0 != o) {
                        i.layoutSuccessful = !0;
                        var r = [];
                        _.each(e.nodes,
                            function(e) {
                                var t = _.clone(i.nodes[e.id]);
                                t.x = 5 * e.x,
                                    t.y = 5 * e.y,
                                    t.fixed = !0,
                                    t.px = void 0,
                                    t.py = void 0,
                                    t.xShift = void 0,
                                    t.yShift = void 0,
                                    r.push(t)
                            }),
                            i.graphViz.selectAll(".link").remove(),
                            i.graphViz.selectAll(".node").remove(),
                            i.graphViz.selectAll(".label").remove(),
                            i.graphViz.empty(),
                            i.zoomTo(r, 1),
                            i.recenter = !1,
                            i.renderGraph({
                                nodes: r,
                                links: e.edges
                            })
                    }
                }
            },
            a.prototype.onError = function(e) {
                //  console.log("WGL Error: " + e)
            },
            this.wglClient = new Client("e0b55635cfe5994665dd5855f63a4efb", "ws://graph-layout-dev.sl.cloud9.ibm.com/backend/srv"),
            this.wglClient.register(new a),
            console.log("New WGL client instance has been instantiated."),
            console.log("Connecting..."),
            this.wglStartTime = (new Date).getTime(),
        useWgl && this.wglClient.login("cdunne@us.ibm.com", "123456"),
            i.firefoxZoomDisplay = _.bind(i.firefoxZoomDisplay, i),
            this.selectedNodeId = null,
            this.force = d3.layout.force().charge( - 4e3).gravity(.3).linkDistance(function(e) {
                return 160 + (nodeSize(e.source) + nodeSize(e.target)) / 2
            }).size([this.width, this.height]).on("end",
                function() {
                    i.recenter && (i.zoomTo(i.nodes, 500), i.recenter = !1),
                        _.each(i.nodes,
                            function(e) {
                                e.fixed = !0
                            }),
                        i.settling = !1
                }),
            this.svg = d3.select(this.divName).append("svg").attr("width", this.width).attr("height", this.height).on("mousewheel",
                function() {
                    i.zoomDisplay()
                }).on("mousedown",
                function() {
                    i.lastMouseDownTime = (new Date).getTime();
                    var e = d3.mouse(this);
                    i.lastMouse = e,
                        i.mouseIsDown = !0,
                        i.recenter = !1,
                        console.log("mousedown at " + e)
                }).on("mouseup",
                function() {
                    var e = d3.mouse(this);
                    i.mouseIsDown = !1,
                        i.lastMouse = e,
                        console.log("mouseup at " + e)
                }).on("mousemove",
                function() {
                    var e = d3.mouse(this);
                    if (console.log("mousemove and mouseIsDown = " + i.mouseIsDown), i.mouseIsDown && !i.mouseOverNode) {
                        var t = [e[0] - i.lastMouse[0], e[1] - i.lastMouse[1]];
                        console.log("mousemove at " + e + " of " + t),
                            i.originX += t[0],
                            i.originY += t[1];
                        var n = "translate(" + i.originX + "," + i.originY + ") scale(" + i.scale + ")";
                        console.log("transform = " + n),
                            i.graphViz.attr("transform", n)
                    }
                    d3.event.preventDefault(),
                        i.lastMouse = e
                }).on("click",
                function(e) { (void 0 === i.lastMouseDownTime || (new Date).getTime() - i.lastMouseDownTime < 500) && (i.selectionManager.clear(), d3.event.preventDefault(), d3.event.stopPropagation(), i.recenter = !1)
                }).on("dblclick",
                function() {
                    i.zoomTo(i.nodes, 1e3)
                }).on("touchstart",
                function() {
                    var e = d3.event.touches.length;
                    if (console.log("touch start, fingers = " + e), i.mouseIsDown = !1, i.recenter = !1, i.selectionManager.clear(), 1 == e) {
                        var t = (new Date).getTime();
                        null != i.lastTapTime && t - i.lastTapTime < 500 && (console.log("double tap on background!"), i.zoomTo(i.nodes, 1e3)),
                            i.lastTapTime = t;
                        var n = d3.event.touches[0].pageX,
                            a = d3.event.touches[0].pageY;
                        i.lastTouch = [n, a]
                    }
                    d3.event.preventDefault()
                }).on("touchend",
                function(e) {
                    console.log("touch end"),
                        d3.event.preventDefault(),
                        i.pinchDistance = null
                }).on("touchmove",
                function(e) {
                    var t = d3.event.touches.length;
                    if (console.log("touch move, fingers = " + t), 1 == t && null == i.touchedNode) {
                        var n = d3.event.touches[0].pageX,
                            a = d3.event.touches[0].pageY,
                            o = [n - i.lastTouch[0], a - i.lastTouch[1]];
                        console.log("touchMove at [" + n + ", " + a + "] of " + o),
                            i.lastTouch = [n, a],
                            i.originX += o[0],
                            i.originY += o[1];
                        var r = "translate(" + i.originX + "," + i.originY + ") scale(" + i.scale + ")";
                        console.log("transform = " + r),
                            i.graphViz.attr("transform", r)
                    } else if (2 == t) {
                        var s = d3.event.touches[0].pageX - d3.event.touches[1].pageX,
                            l = d3.event.touches[0].pageY - d3.event.touches[1].pageY,
                            c = Math.sqrt(s * s + l * l),
                            u = 0;
                        null != i.pinchDistance && (u = c - i.pinchDistance),
                            i.pinchDistance = c;
                        var d = u * (maxScale - minScale) / 500,
                            p = i.container.offset(),
                            n = (d3.event.touches[0].pageX + d3.event.touches[1].pageX) / 2 - p.left,
                            a = (d3.event.touches[1].pageY + d3.event.touches[1].pageY) / 2 - p.top;
                        console.log("pinch distance = " + c + " change = " + u + " scaleDelta = " + d + " position = " + n + ", " + a),
                            i.adjustZoom(d, [n, a])
                    }
                    d3.event.preventDefault()
                });
        var o = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
        o && this.svg.on("wheel.zoom", i.firefoxZoomDisplay),
            this.graphViz = this.svg.append("g").attr("pointer-events", "all").attr("transform", "translate(" + this.originX + "," + this.originY + ") scale(" + this.scale + ")").attr("height", this.height - 10),
            this.eventBroker.subscribe("active.add",
                function(e, t) {
                    var n = "_active",
                        a = i.selectionManager.get();
                    if (0 !== a.length) {
                        var o = a[0];
                        if (o == t.toString()) n = "_active_selected";
                        else {
                            var r = i.nodes[o];
                            if ("location" === r.type) {
                                var s = i.getLocatedArticles(r);
                                _.contains(s, t) && (n = "_active_located")
                            }
                        }
                    }
                    // d3.select("#icon-" + t).attr("xlink:href",
                    //     function(e) {
                    //         return "images/entities/colorized/" + nodeType(e) + n + ".png"
                    //     }),
                    //     i.activeNodes.push(i.nodes[t])
                }),
            this.eventBroker.subscribe("active.remove",
                function(e, t) {
                    var n = "_default",
                        a = i.selectionManager.get();
                    if (0 !== a.length) {
                        var o = a[0];
                        if (o == t.toString()) n = "_selected";
                        else {
                            var r = i.nodes[o];
                            if ("location" === r.type) {
                                var s = i.getLocatedArticles(r);
                                _.contains(s, t) && (n = "_located")
                            }
                        }
                    }
                    // d3.select("#icon-" + t).attr("xlink:href",
                    //     function(e) {
                    //         return "images/entities/colorized/" + nodeType(e) + n + ".png"
                    //     }),
                    //     i.activeNodes = _.without(i.activeNodes, i.nodes[t])
                }),
            this.eventBroker.subscribe("active.change",
                function(e) {
                    i.zoomTo(i.activeNodes.length > 0 ? i.activeNodes: i.nodes)
                }),
            this.eventBroker.subscribe("selection.add",
                function(e, t) {
                    if (i.selectedNodeId = t, null != i.nodes) {
                        var n = i.nodes[t],
                            a = "_selected";
                        if (_.find(i.activeNodes,
                                function(e) {
                                    return e.id == t
                                }) && (a = "_active_selected"), d3.select("#icon-" + t).attr("xlink:href",
                                function(e) {
                                    // return "images/entities/colorized/" + nodeType(e) + a + ".png"
                                }), d3.selectAll(".link").filter(function(e) {
                                return e.source.id == t || e.target.id == t
                            }).style("stroke-width", 12).style("stroke-opacity", .8).classed(n.type + "-selected-link", !0), "location" === n.type) {
                            var o = i.getLocatedArticles(n);
                            _.each(o,
                                function(e) {
                                    // var t = "_located";
                                    // _.contains(i.activeNodes, i.nodes[e]) && (t = "_active_located"),
                                    //     d3.select("#icon-" + e).attr("xlink:href", "images/entities/colorized/article" + t + ".png")
                                })
                        }
                    }
                }),
            this.eventBroker.subscribe("selection.remove",
                function(e, t) {
                    if (i.selectedNodeId = null, null != i.nodes) {
                        var n = i.nodes[t],
                            a = "_default";
                        if (_.find(i.activeNodes,
                                function(e) {
                                    return e.id == t
                                }) && (a = "_active"), d3.select("#icon-" + t).attr("xlink:href",
                                function(e) {
                                    // return "images/entities/colorized/" + nodeType(n) + a + ".png"
                                }), d3.selectAll(".link").filter(function(e) {
                                return e.source.id == t || e.target.id == t
                            }).style("stroke-width",
                                function(e) {
                                    return linkWidth(e)
                                }).style("stroke-opacity", .4).classed(n.type + "-selected-link", !1), "location" === n.type) {
                            var o = i.getLocatedArticles(n);
                            // _.each(o,
                            //     function(e) {
                            //         var t = "_default";
                            //         _.contains(i.activeNodes, i.nodes[e]) && (t = "_active"),
                            //             d3.select("#icon-" + e).attr("xlink:href", "images/entities/colorized/article" + t + ".png")
                            //     })
                        }
                    }
                }),
            this.eventBroker.subscribe("selection.change",
                function(e) {
                    var t = i.selectionManager.get();
                    if (t.length > 0 && null != i.nodes) {
                        var n = i.nodes[Number(t[0])];
                        if (i.autoSelectedId != n.id.toString()) {
                            var a = [n];
                            _.each(i.links,
                                function(e) {
                                    e.source == n ? a.push(e.target) : e.target == n && a.push(e.source)
                                }),
                                i.zoomTo(a)
                        } else i.autoSelectedId = null
                    }
                }),
            this.eventBroker.subscribe("hover.add",
                function(e, t) {
                    d3.selectAll(".node").filter(function(e) {
                        return e.id == t
                    }).style({
                        opacity: medOpacity
                    })
                }),
            this.eventBroker.subscribe("hover.remove",
                function(e, t) {
                    d3.selectAll(".node").filter(function(e) {
                        return e.id == t
                    }).style({
                        opacity: lowOpacity
                    })
                }),
            $("#zoom-button-in").on("click",
                function(e) {
                    e.stopPropagation(),
                        e.preventDefault(),
                        i.adjustZoom(i.scale / 2, [i.width / 2, i.height / 2], 500)
                }),
            $("#zoom-button-out").on("click",
                function(e) {
                    e.stopPropagation(),
                        e.preventDefault(),
                        i.adjustZoom( - i.scale / 2, [i.width / 2, i.height / 2], 500)
                }),
            $(".network-checkbox").on("click",
                function(e) {
                    var t = this.name.substr(5),
                        n = "visible";
                    this.checked ? i.visibleNodeTypes.push(t) : (i.visibleNodeTypes = _.without(i.visibleNodeTypes, t), n = "hidden"),
                        d3.selectAll(".node").filter(function(e) {
                            return e.type === t
                        }).style("visibility",
                            function(e) {
                                return i.nodeVisibility(e)
                            }),
                        d3.selectAll(".node-label").filter(function(e) {
                            return e.type === t
                        }).style("visibility",
                            function(e) {
                                return i.nodeVisibility(e)
                            }),
                        d3.selectAll(".link").style("visibility",
                            function(e) {
                                return i.linkVisibility(e)
                            })
                })
    };
Network.prototype.showContextNodes = function(e) {
    var t = this,
        n = e ? "visible": "hidden";
    d3.selectAll(".node").filter(function(e) {
        return _.contains(t.visibleNodeTypes, e.type) && (e.filtered > 0 || 0 == e.middle || null != e.contextCode && context[e.contextCode])
    }).style("visibility", n),
        d3.selectAll(".node-label").filter(function(e) {
            return _.contains(t.visibleNodeTypes, e.type) && (e.filtered > 0 || 0 == e.middle || null != e.contextCode && context[e.contextCode])
        }).style("visibility", n),
        d3.selectAll(".link").style("visibility",
            function(e) {
                return t.linkVisibility(e)
            })
},
    Network.prototype.data = function(e) {
        var t = this;
        this.activeNodes = [],
            this.originX = this.width / 2,
            this.originY = this.height / 2,
            this.scale = initialScale,
            this.transform(initialScale, this.originX, this.originY, 100),
            e.links.forEach(function(t, n, i) {
                "undefined" == typeof e.nodes[t.source] && console.log("undefined source", t),
                "undefined" == typeof e.nodes[t.target] && console.log("undefined target", t)
            }),
            this.populateStats(e.nodes),
            this.nodes = e.nodes,
            this.links = _.map(e.links,
                function(e) {
                    return _.clone(e)
                }),
            useWgl && this.wglLoggedIn ? (this.layoutSuccessful = !1, t.layoutRequested = !0, this.requestGraphLayout(this.nodes, this.links), setTimeout(function() {
                    t.layoutSuccessful || (console.log("giving up on WGL"), t.layoutRequested = !1, t.renderGraph(e, !0))
                },
                1e4)) : (console.log("Using D3 force directed layout"), this.renderGraph(e, !1))
    },
    Network.prototype.renderGraph = function(e, t) {
        var n = this;
        this.nodes = e.nodes,
            this.links = _.map(e.links,
                function(e) {
                    return _.clone(e)
                }),
            console.log("rendering graph"),
            this.clear(),
            this.tooltip = new CV.Tooltip({
                parent: this.container,
                autohide: 8e3,
                position: {
                    adjust: {
                        x: 0,
                        y: 80
                    },
                    viewport: $(window)
                }
            }),
            this.tooltip.hide(),
            this.recenter = !0,
            this.settling = !0,
            this.force.nodes(this.nodes).links(this.links).start();
        var i = this.graphViz.selectAll(".link").data(this.links).enter().append("line").attr("class", "link").style("stroke-width",
            function(e) {
                return linkWidth(e)
            }).style("stroke-opacity", .4).style("visibility",
            function(e) {
                return n.linkVisibility(e)
            }),
            a = this.graphViz.selectAll(".node").data(e.nodes).enter().append("g").attr("title",
                function(e) {
                    return e.name
                }).attr("class", "node").style("visibility",
                function(e) {
                    return t ? "hidden": n.nodeVisibility(e)
                }).style("opacity", lowOpacity).on("mousedown",
                function(e) {
                    d3.select(this).style("opacity", highOpacity)
                }).on("mouseup",
                function(e) {
                    d3.select(this).style("opacity", medOpacity)
                }).on("mouseover",
                function(e) {
                    if ("visible" == n.nodeVisibility(e)) {
                        if (!e.persistentLabel && (n.scale <= labelScale && "article" != e.type || "article" == e.type)) {
                            var t = e.name,
                                i = d3.event.x + $("#entity-details-area").width(),
                                a = d3.event.y;
                            n.tooltip.show({
                                x: i,
                                y: a,
                                title: t
                            })
                        }
                        n.eventBroker.publish("hover.add", e.id),
                            n.mouseOverNode = !0;
                        var o = n.nodes[e.id];
                        d3.selectAll(".link").filter(function(t) {
                            return (t.source.id == e.id || t.target.id == e.id) && n.selectedNodeId != t.source.id && n.selectedNodeId != t.target.id
                        }).style("stroke-width", 12).style("stroke-opacity", .8).classed(o.type + "-selected-link", !0)
                    }
                }).on("mouseout",
                function(e) {
                    console.log("mouseOut "),
                        n.eventBroker.publish("hover.remove", e.id),
                    null != n.tooltip && n.tooltip.hide(),
                    n.mouseIsDown || (n.mouseOverNode = !1);
                    var t = n.nodes[e.id];
                    d3.selectAll(".link").filter(function(t) {
                        return (t.source.id == e.id || t.target.id == e.id) && n.selectedNodeId != t.source.id && n.selectedNodeId != t.target.id
                    }).style("stroke-width", 4).style("stroke-opacity", .4).classed(t.type + "-selected-link", !1)
                }).on("click",
                function(e) {
                    console.log("got a click"),
                    (void 0 === n.lastMouseDownTime || (new Date).getTime() - n.lastMouseDownTime < 500) && (d3.event.preventDefault(), d3.event.stopPropagation(), n.recenter = !1, _.contains(n.selectionManager.get(), e.id.toString()) ? n.selectionManager.remove(e.id.toString()) : n.selectionManager.set(e.id.toString()))
                }).on("dblclick",
                function(e) {
                    console.log("doubleClicked"),
                        d3.event.preventDefault(),
                        d3.event.stopPropagation(),
                        n.selectionManager.set(e.id.toString()),
                    "article" !== e.type && newsQuery(e.name, e.type)
                }).on("touchstart",
                function() {
                    console.log("touch start");
                    var e = d3.event.touches.length;
                    if (console.log("touch start, fingers = " + e), n.mouseIsDown = !1, n.recenter = !1, 1 == e) {
                        var t = d3.event.target.id.substr(5);
                        n.recenter = !1;
                        var i = n.nodes[t];
                        n.touchedNode = i;
                        var a = (new Date).getTime();
                        if (null != n.lastTapTime && a - n.lastTapTime < 500 && (console.log("double tap on node!"), n.selectionManager.set(i.id.toString()), "article" !== i.type && newsQuery(i.name, i.type)), n.lastTapTime = a, !i.persistentLabel && (n.scale <= labelScale || "article" == i.type)) {
                            var o = i.name;
                            i.clientX = d3.event.touches[0].clientX,
                                i.clientY = d3.event.touches[0].clientY;
                            var r = i.clientX + +$("#entity-details-area").width(),
                                s = i.clientY;
                            n.showTooltip(r, s, o, 5e3)
                        }
                        d3.event.preventDefault(),
                            d3.event.stopPropagation()
                    }
                }).on("touchmove",
                function() {
                    var e = d3.event.touches.length;
                    null != n.touchedNode && 1 == e && (n.touchedNode.x = d3.event.touches[0].pageX, n.touchedNode.y = d3.event.touches[0].pageY),
                        d3.event.preventDefault(),
                        d3.event.stopPropagation()
                }).on("touchend",
                function() {
                    var e = (new Date).getTime();
                    if (null != n.touchedNode && null != n.lastTapTime && e - n.lastTapTime < 1e3) {
                        var t = n.touchedNode,
                            i = t.id;
                        _.contains(n.selectionManager.get(), i) ? n.selectionManager.remove(i) : n.selectionManager.set(i)
                    }
                    n.touchedNode = null,
                        n.hideTooltip(5e3),
                        console.log("touch end")
                }).on("touchmove",
                function() {
                    console.log("touch move")
                }).call(this.force.drag);
       /* a.append("image").attr("xlink:href",
            function(e) {
                return "images/entities/colorized/" + nodeType(e) + "_default.png"
            }).attr("class", "icon").attr("id",
            function(e) {
                return "icon-" + e.id
            }).attr("x",
            function(e) {
                return - nodeSize(e) / 2
            }).attr("y",
            function(e) {
                return - nodeSize(e) / 2
            }).attr("width",
            function(e) {
                return nodeSize(e)
            }).attr("height",
            function(e) {
                return nodeSize(e)
            });*/
        var o = this.graphViz.selectAll(".label").data(e.nodes).enter().append("text").filter(function(e) {
            return "article" != e.type
        }).attr("class",
            function(e) {
                return "label " + (e.persistentLabel ? "persistent-node-label": "node-label")
            }).attr("id",
            function(e) {
                return "node-label-" + e.id
            }).style("visibility",
            function(e) {
                return t ? "hidden": n.nodeVisibility(e)
            }).attr("transform",
            function(e) {
                return "scale(" + (e.persistentLabel ? 1 / n.scale: 1) + ")"
            }).attr("opacity",
            function(e) {
                return e.persistentLabel ? "1.0": "0"
            }).attr("pointer-events", "none").attr("font-family", "'Open Sans', sans-serif").attr("font-size", "24px").attr("font-weight", "normal").attr("fill", "#FFFFFF");
        if (o.append("tspan").attr("class", "label-line").attr("dx", 0).attr("dy", 0).attr("text-anchor", "middle").text(function(e) {
                if (e.name.length < 30) return e.name;
                for (var t = e.name.substring(0, 30), n = t.length; n > 0; n--) if (" " == t.charAt(n - 1)) return t = t.substring(0, n - 1);
                return e.name
            }), o.append("tspan").filter(function(e) {
                return e.name.length > 30
            }).attr("class", "label-line").attr("dx", 0).attr("text-anchor", "middle").attr("dy", 28).attr("text-anchor", "middle").text(function(e) {
                for (var t = e.name.substring(0, 30), n = t.length; n > 0; n--) if (" " == t.charAt(n - 1)) {
                    var i = e.name.substring(n);
                    return i
                }
                for (var n = t.length; n < e.name.length; n++) if (" " == e.name.charAt(n)) {
                    var i = e.name.substring(n);
                    return i
                }
                return ""
            }), this.force.on("tick",
                function() {++n.tickCount >= 298 && (i.attr("x1",
                    function(e) {
                        return e.source.x
                    }).attr("y1",
                    function(e) {
                        return e.source.y
                    }).attr("x2",
                    function(e) {
                        return e.target.x
                    }).attr("y2",
                    function(e) {
                        return e.target.y
                    }), a.attr("transform",
                    function(e) {
                        return "translate(" + e.x + "," + e.y + ")"
                    }).style("visibility",
                    function(e) {
                        return n.nodeVisibility(e)
                    }), o.attr("x",
                    function(e) {
                        return e.persistentLabel ? n.scale * e.x: e.x
                    }).attr("y",
                    function(e) {
                        return e.persistentLabel ? n.scale * (e.y + nodeSize(e) / 2) : e.y + nodeSize(e) / 2
                    }).style("visibility",
                    function(e) {
                        return n.nodeVisibility(e)
                    }), d3.selectAll(".label-line").attr("x",
                    function(e) {
                        return e.persistentLabel ? n.scale * e.x: e.x
                    }), 298 == n.tickCount && null != n.renderCompleteCallback && (n.zoomTo(n.nodes, 1), n.renderCompleteCallback()))
                }), t) {
            n.tickCount = 0;
            for (var r = 0; 300 >= r; r++) setTimeout(function() {
                    n.force.tick()
                },
                r)
        } else n.tickCount = 300,
        null != this.renderCompleteCallback && this.renderCompleteCallback();
        console.log("network data loaded")
    },
    Network.prototype.requestGraphLayout = function(e, t) {
        console.log("requesting WGL layout of " + e.length + " nodes and " + t.length + " edges");
        var n = [],
            i = [];
        _.each(e,
            function(e) {
                n.push({
                    id: e.id,
                    radius: e.radius,
                    x: 0,
                    y: 0
                })
            }),
            _.each(t,
                function(e) {
                    i.push({
                        id: e.id,
                        source: e.source,
                        target: e.target
                    })
                }),
            this.wglClient.putGraph("News-Explorer", n, i),
            console.log("Computing graph layout..."),
            this.wglClient.layoutGraph("NEATO", {})
    };
var context = [!0, !0, !0, !1, !0, !1, !1, !1];
Network.prototype.nodeVisibility = function(e) {
    if (!_.contains(imageTypes, e.type)) return "visible";
    if (_.contains(this.visibleNodeTypes, e.type)) {
        var t = !0;
        if ($("#show-context").length > 0 && (t = $("#show-context").prop("checked")), t || (null == e.contextCode || !context[e.contextCode]) && (void 0 == e.filtered || 0 == e.filtered && 0 != e.middle)) return "visible"
    }
    return e.forceVisible ? "visible": "hidden"
},
    Network.prototype.linkVisibility = function(e) {
        return "visible" == this.nodeVisibility(e.source) && "visible" == this.nodeVisibility(e.target) ? "visible": "hidden"
    },
    Network.prototype.zoomDisplay = function() {
        var e = d3.mouse(this.svg[0][0]);
        if (e[1] < this.height) {
            var t = d3.event.wheelDelta;
            console.log("mouseWheel: " + t),
                d3.event.preventDefault(),
            null == t && console.log("didn't get good mousewheel delta"),
                this.adjustZoom(t / 12e3, e)
        }
    },
    Network.prototype.firefoxZoomDisplay = function() {
        var e = d3.mouse(this.svg[0][0]),
            t = d3.event.deltaY;
        console.log("mouseWheel: " + t),
            d3.event.preventDefault(),
        null == t && console.log("didn't get good mousewheel delta"),
            this.adjustZoom(t / 120, e)
    },
    Network.prototype.adjustZoom = function(e, t, n) {
        n = n || 0;
        var i = this.scale;
        this.recenter = !1;
        var a = (t[0] - this.originX) / this.scale,
            o = (t[1] - this.originY) / this.scale;
        this.scale = e > 0 ? Math.min(maxScale, (this.scale + e).toFixed(3)) : Math.max(minScale, (this.scale + e).toFixed(3)),
            console.log("scale = " + this.scale),
            this.showNodeLabels(this.scale);
        var r = (t[0] - this.originX) / this.scale,
            s = (t[1] - this.originY) / this.scale;
        return this.originX -= (a - r) * this.scale,
            this.originY -= (o - s) * this.scale,
        this.scale !== i && this.transform(this.scale, this.originX, this.originY, n),
            !1
    },
    Network.prototype.transform = function(e, t, n, i) {
        null != this.tooltip && this.tooltip.hide(),
            i |= 0;
        var a = "translate(" + t + "," + n + ") scale(" + e + ")";
        console.log("transform = " + a),
            this.graphViz.transition(i).duration(i).attr("transform", a)
    },
    Network.prototype.zoomTo = function(e, t) {
        var n = this;
        t = t || 1e3;
        var i = _.filter(e,
            function(e) {
                return "visible" == n.nodeVisibility(e)
            }),
            a = -Number.MAX_VALUE,
            o = Number.MAX_VALUE,
            r = -Number.MAX_VALUE,
            s = Number.MAX_VALUE;
        i.length > 0 ? _.each(i,
            function(e) {
                a = Math.max(a, e.x),
                    r = Math.max(r, e.y),
                    o = Math.min(o, e.x),
                    s = Math.min(s, e.y)
            }) : (o = 0, s = 0, a = this.width, r = this.height);
        var l = a - o,
            c = r - s,
            u = (a + o) / 2,
            d = (r + s) / 2,
            p = .8 / Math.max(l / this.width, c / this.height);
        return p = Math.max(minScale, Math.min(p, maxScale)),
            isNaN(p) ? void console.log("too soon to zoom") : (this.scale = p, this.showNodeLabels(this.scale), this.originX = this.width / 2 - p * u, this.originY = this.height / 2 - p * d, this.transform(this.scale, this.originX, this.originY, t), n.recenter = !1, void console.log("zooming to (" + o + "," + s + ") (" + a + "," + r + ")"))
    },
    Network.prototype.showNodeLabels = function(e) {
        $(".node-label").attr(e > labelScale ? {
            opacity: "1.0"
        }: {
            opacity: "0.0"
        }),
            d3.selectAll(".persistent-node-label").attr({
                opacity: 1
            }).attr("x",
                function(t) {
                    $(this).width();
                    return e * t.x
                }).attr("y",
                function(t) {
                    return e * (t.y + nodeSize(t) / 2)
                }).attr("transform",
                function(t) {
                    nodeSize(t) / 2;
                    return "scale(" + 1 / e + ")"
                }),
            d3.selectAll(".label-line").attr("x",
                function(t) {
                    return t.persistentLabel ? t.x * e: t.x
                })
    },
    Network.prototype.populateStats = function(e) {
        var t = {};
        _.each(e,
            function(e) {
                null == t[e.type] && (t[e.type] = 0),
                    t[e.type]++
            }),
            $("#article-count").text(null != t.article ? t.article: 0),
            $("#company-count").text(null != t.company ? t.company: 0),
            $("#organization-count").text(null != t.organization ? t.company: 0),
            $("#person-count").text(null != t.person ? t.person: 0);
        for (var n in t) t.hasOwnProperty(n) && console.log(n + ":	" + t[n]);
        return t
    },
    Network.prototype.resize = function() {
        this.width = $(this.divName).width(),
            this.height = $(this.divName).height(),
            this.force.size([this.width, this.height]),
            this.svg.attr("width", this.width).attr("height", this.height)
    },
    Network.prototype.enableRecenter = function() {
        this.recenter = !0
    },
    Network.prototype.autoSelected = function(e) {
        this.autoSelectedId = e
    },
    Network.prototype.getLocatedArticles = function(e) {
        var t = [];
        return _.each(this.links,
            function(n) {
                n.target === e && "article" === n.source.type && t.push(n.source.id)
            }),
            t
    },
    Network.prototype.onRenderComplete = function(e) {
        this.renderCompleteCallback = e
    },
    Network.prototype.showTooltip = function(e, t, n, i) {
        var a = this;
        null != this.tooltipTimer && (clearTimeout(this.tooltipTimer), this.tooltipTimer = null),
            this.tooltip.hide(),
            this.tooltip.show({
                x: e,
                y: t,
                title: n
            }),
        null != i && (this.tooltipTimer = setTimeout(function() {
                a.tooltip.hide(),
                    a.tooltipTimer = null
            },
            i))
    },
    Network.prototype.hideTooltip = function(e) {
        var t = this;
        null != this.tooltipTimer && (clearTimeout(this.tooltipTimer), this.tooltipTimer = null),
            null == e ? (this.tooltip.hide(), this.tooltipTimer = null) : this.tooltipTimer = setTimeout(function() {
                    t.tooltip.hide(),
                        t.tooltipTimer = null
                },
                e)
    },
    Network.prototype.clear = function() {
        this.graphViz.selectAll(".link").remove(),
            this.graphViz.selectAll(".node").remove(),
            this.graphViz.selectAll(".label").remove(),
            this.graphViz.empty()
    };
var secondInMillis = 1e3,
    minuteInMillis = 60 * secondInMillis,
    hourInMillis = 60 * minuteInMillis,
    dayInMillis = 24 * hourInMillis,
    weekInMillis = 7 * dayInMillis,
    monthInMillis = 28 * dayInMillis,
    yearInMillis = 52 * weekInMillis,
    centuriesInMillis = 100 * yearInMillis;
articles = [],
    enableColumnSelectMode = !1;
var Timeline = function(e, t) {
    this.divName = "#timeline",
        this.width = $(this.divName).width(),
        this.height = $(this.divName).height(),
        this.eventBroker = e,
        this.selectionManager = t,
        this.activeNodes = [],
        this.svg = d3.select(this.divName).append("svg").attr("width", this.width).attr("height", this.height).attr("id", "timelineSVG")
};
Timeline.prototype.data = function(e) {
    if (this.nodes = e.nodes, this.links = e.links, this.container = $(this.divName), articles = [], _.each(this.nodes,
            function(e) {
                "article" === e.type && articles.push(e)
            }), articles.sort(function(e, t) {
            return e = new Date(e.date),
                t = new Date(t.date),
                t > e ? -1 : e > t ? 1 : 0
        }), this.colCount, this.rowCount = 8, articles.length > 0) {
        this.dateMin = new Date(articles[0].date),
            this.dateMax = new Date(articles[articles.length - 1].date),
            this.dateMinUsed = this.dateMin;
        for (var t = 0; this.dateMinUsed < 0;) this.dateMinUsed = new Date(articles[t].date),
            t++;
        this.dateMaxUsed = this.dateMax,
            t = articles.length - 1;
        for (var n = new Date,
                 i = n.getTime(); this.dateMaxUsed.getTime() > i;) this.dateMaxUsed = new Date(articles[t].date),
            t--;
        this.timeRangeUsed = getTimeRangeMillis(this.dateMinUsed, this.dateMaxUsed),
            updatePrintedTime(this.timeRangeUsed),
            0 == this.timeRangeUsed ? this.colCount = 1 : this.timeRangeUsed < 2 * hourInMillis ? (this.colCount = Math.ceil(this.timeRangeUsed / minuteInMillis), this.timeRangeUsed += this.colCount * minuteInMillis - this.timeRangeUsed) : this.timeRangeUsed < 10 * hourInMillis ? (this.colCount = Math.ceil(this.timeRangeUsed / (hourInMillis / 12)), this.timeRangeUsed += this.colCount * (hourInMillis / 12) - this.timeRangeUsed) : this.timeRangeUsed < 30 * hourInMillis ? (this.colCount = Math.ceil(this.timeRangeUsed / (hourInMillis / 4)), this.timeRangeUsed += this.colCount * (hourInMillis / 4) - this.timeRangeUsed) : this.timeRangeUsed < 60 * hourInMillis ? (this.colCount = Math.ceil(this.timeRangeUsed / (hourInMillis / 2)), this.timeRangeUsed += this.colCount * (hourInMillis / 2) - this.timeRangeUsed) : this.timeRangeUsed < 5 * dayInMillis ? (this.colCount = Math.ceil(this.timeRangeUsed / hourInMillis), this.timeRangeUsed += this.colCount * hourInMillis - this.timeRangeUsed) : this.timeRangeUsed < 4 * monthInMillis ? (this.colCount = Math.ceil(this.timeRangeUsed / dayInMillis), this.timeRangeUsed += this.colCount * dayInMillis - this.timeRangeUsed) : this.timeRangeUsed < 10 * yearInMillis ? (this.colCount = Math.ceil(this.timeRangeUsed / monthInMillis), this.timeRangeUsed += this.colCount * monthInMillis - this.timeRangeUsed) : (this.colCount = Math.ceil(this.timeRangeUsed / yearInMillis), this.timeRangeUsed += this.colCount * yearInMillis - this.timeRangeUsed),
            this.timeRangePerColumn = this.timeRangeUsed / this.colCount
    }
    this.articles = articles,
        this.render()
},
    Timeline.prototype.render = function() {
        var e = this;
        this.activeColumn;
        var t = this.articles || [];
        this.w = this.width,
            this.h = this.height,
            this.cellOffsetX = this.w / this.colCount,
            this.cellOffsetY = this.h / this.rowCount * .37,
            this.cellSpacingX = 2,
            this.cellWidth = this.cellOffsetX - this.cellSpacingX,
            this.cellSpacingY = 2,
            this.cellHeight = this.cellOffsetY - this.cellSpacingY;
        var n, i = 0,
            a = 0;
        for (s = 0; s < t.length; s++) {
            var o = new Date(t[s].date),
                r = o.getTime() - this.dateMinUsed.getTime();
            t[s].timeColIndex = o < this.dateMinUsed ? -1 : o > this.dateMaxUsed ? this.colCount: Math.floor(r / (this.timeRangePerColumn + 1)),
                i = t[s].timeColIndex,
                i === n ? a++:a = 0,
                n = i,
            a > this.rowCount && (a = this.rowCount),
                t[s].timeRowIndex = a,
                t[s].xShift = i * this.cellOffsetX,
                t[s].yShift = (this.rowCount - a) * this.cellOffsetY
        }
        for (var s = 0; s < this.colCount; s++) {
            for (var l = 0,
                     c = 0,
                     u = 0; u < t.length; u++) t[u].timeColIndex === s && (l++, c = u);
            for (var d = 0; l > d; d++) t[c - d].articleTotalInTimeColumn = l
        }
        this.svg.selectAll("*").remove(),
            this.svg.attr("width", this.w).attr("height", this.h);
        for (var p = [], h = 0; h < this.colCount; h++) for (var g = 0; g < this.rowCount; g++) p.push({
            x: h,
            y: g
        });
        this.timelineEmptyCells = this.svg.append("g"),
            this.timelineEmptyCells.selectAll("rect").data(p).enter().append("rect").attr("class", "empty-timeline-cell").attr("x",
                function(t) {
                    var n = t.x * e.cellOffsetX;
                    return n
                }).attr("y",
                function(t) {
                    var n = (e.rowCount - t.y) * e.cellOffsetY;
                    return n + 16
                }).attr("width", this.cellWidth).attr("height", this.cellHeight).attr("fill",
                function(e) {
                    return "rgba(244, 244, 244, 0.1)"
                }).attr("stroke-width", this.cellSpacingY).attr("stroke", "rgba(0,0,0,0.0)").on("click",
                function(t) {
                    enableColumnSelectMode && e.advanceTimeline(t)
                }),
            this.timelineGroup = this.svg.append("g"),
            this.timelineGroup.selectAll("rect").data(t).enter().append("rect").attr("class", "timeline-cell").attr("x",
                function(e) {
                    return e.xShift
                }).filter(function(e) {
                return 8 != e.timeRowIndex
            }).attr("y",
                function(e) {
                    return e.yShift + 16
                }).attr("width", this.cellWidth).attr("height", this.cellHeight).attr("fill",
                function(t) {
                    if (8 === t.timeRowIndex) return "rgba(100, 100, 100, 0)";
                    if (t.timeColIndex < e.colCount) {
                        var n = .5;
                        return null != t.sentiment && (n = (t.sentiment + 1) / 2 * .8 + .2),
                        "rgba(0,166,160," + n + ")"
                    }
                    return "rgba(255, 255, 255, 0)"
                }).attr("rx",
                function(e) {
                    return 3
                }).attr("ry",
                function(e) {
                    return 3
                }).attr("stroke", "rgba(0, 0, 0, 0.0)").attr("stroke-width", "0").attr("stroke-linecap", "round").attr("title",
                function(t) {
                    var n = e.getToolTipTitle(t) + ", " + e.getToolTipBody(t);
                    return n
                }).on("mousedown",
                function(t) {
                    e.onMouseDown(t)
                }).on("mousemove",
                function(t) {
                    e.onMouseMove(t)
                }).on("mouseover",
                function(t) {
                    e.onMouseEnter(t)
                }).on("mouseout",
                function(t) {
                    e.onMouseLeave(t)
                }).on("click",
                function(t) {
                    e.onClick(t),
                        e.timelineEmptyCells.selectAll("rect").attr("fill", "rgba(244, 244, 244, 0.1)")
                }),
            this.futureTimeInColumn = this.timeRangeUsed - (this.dateMaxUsed - this.dateMinUsed),
            this.futureDateMax = new Date(this.dateMaxUsed + this.futureTimeInColumn),
            this.xScale = d3.time.scale().domain([this.futureDateMax, this.dateMinUsed]).range([this.w, 0]);
        var y = (d3.format(",.0f"), d3.time.format.multi([[".%L",
            function(e) {
                return e.getMilliseconds()
            }], [":%S",
            function(e) {
                return e.getSeconds()
            }], ["%I:%M",
            function(e) {
                return e.getMinutes()
            }], ["%I %p",
            function(e) {
                return e.getHours()
            }], ["%a %d",
            function(e) {
                return e.getDay() && 1 != e.getDate()
            }], ["%b %d",
            function(e) {
                return 1 != e.getDate()
            }], ["%B",
            function(e) {
                return e.getMonth()
            }], ["%Y",
            function() {
                return ! 0
            }]]));
        this.xAxis = d3.svg.axis().scale(this.xScale).orient("bottom").tickFormat(y),
        this.colCount > 1 && this.svg.append("g").attr("class", "xAxis").call(this.xAxis),
            this.tooltip = new CV.Tooltip({
                parent: this.container,
                autohide: 8e3,
                position: {
                    adjust: {
                        x: 5,
                        y: 45
                    },
                    viewport: $(window)
                }
            }),
            this.tooltip.hide(),
            this.eventBroker.subscribe("active.add",
                function(t, n) {
                    var i = e.selectionManager.get();
                    if (0 !== i.length) {
                        var a = i[0],
                            o = e.nodes[a];
                        if (a == n) e.highlight(n, !0, !0, !1);
                        else if ("location" === o.type) {
                            var r = e.getLocatedArticles(o);
                            _.contains(r, n) ? e.highlight(n, !1, !0, !0) : e.highlight(n, !1, !0, !1)
                        } else e.highlight(n, !1, !0, !1)
                    } else e.highlight(n, !1, !0, !1);
                    e.activeNodes.push(e.nodes[n])
                }),
            this.eventBroker.subscribe("active.remove",
                function(t, n) {
                    var i = e.selectionManager.get();
                    if (0 !== i.length) {
                        var a = i[0],
                            o = e.nodes[a];
                        if (a == n) e.highlight(n, !0, !1, !1);
                        else if ("location" === o.type) {
                            var r = e.getLocatedArticles(o);
                            _.contains(r, n) ? e.highlight(n, !1, !1, !0) : e.highlight(n, !1, !1, !1)
                        } else e.highlight(n, !1, !1, !1)
                    } else e.highlight(n, !1, !1, !1);
                    e.activeNodes = _.without(e.activeNodes, e.nodes[n])
                }),
            this.eventBroker.subscribe("selection.add",
                function(t, n) {
                    var i = e.nodes[n];
                    if ("article" === i.type) {
                        var a = _.some(e.activeNodes,
                            function(e) {
                                return e.id == n
                            });
                        e.highlight(n, !0, a, !1)
                    } else if ("location" === i.type) {
                        var o = e.getLocatedArticles(i);
                        _.each(o,
                            function(t) {
                                var n = _.some(e.activeNodes,
                                    function(e) {
                                        return e.id == t
                                    });
                                e.highlight(t, !1, n, !0)
                            })
                    }
                }),
            this.eventBroker.subscribe("selection.remove",
                function(t, n) {
                    var i = e.nodes[n];
                    if ("article" === i.type) {
                        var a = _.some(e.activeNodes,
                            function(e) {
                                return e.id == n
                            });
                        e.highlight(n, !1, a, !1)
                    } else if ("location" === i.type) {
                        var o = e.getLocatedArticles(i);
                        _.each(o,
                            function(t) {
                                var n = _.some(e.activeNodes,
                                    function(e) {
                                        return e.id == t
                                    });
                                e.highlight(t, !1, n, !1)
                            })
                    }
                })
    },
    Timeline.prototype.highlight = function(e, t, n, i) {
        var a, o = "1.5";
        if (n) a = t ? "rgba(89, 114, 25, 1)": "rgba(219, 39, 128, 1)";
        else if (i) a = "rgba(178, 228, 50, 1)";
        else {
            if (!t) return void this.timelineGroup.selectAll("rect").filter(function(t) {
                return t.id == e
            }).attr("stroke-width", "0");
            a = "rgba(255, 255, 255, 1)"
        }
        this.timelineGroup.selectAll("rect").filter(function(t) {
            return t.id == e
        }).attr("stroke", a).attr("stroke-width", o).attr("stroke-linecap", "round"),
        enableColumnSelectMode && this.timelineGroup.selectAll("rect").filter(function(t) {
            return t.id != e && "rgba(255, 255, 255, 1.0)" == $(this).attr("stroke")
        }).attr("stroke", "rgba(0, 0, 0, 0.0)").attr("stroke-width", "0").attr("stroke-linecap", "round")
    },
    Timeline.prototype.onMouseDown = function(e) {},
    Timeline.prototype.onMouseMove = function(e) {},
    Timeline.prototype.onMouseEnter = function(e) {
        var t = this.getToolTipTitle(e),
            n = this.getToolTipBody(e),
            i = d3.event.x + 5,
            a = d3.event.y + $("#visualizations-area").height();
        this.tooltip.show({
            x: i,
            y: a,
            title: t,
            body: n
        })
    },
    Timeline.prototype.onMouseLeave = function() {
        this.tooltip.hide()
    },
    Timeline.prototype.onClick = function(e) {
        _.contains(self.selectionManager.get(), e.id.toString()) ? self.selectionManager.remove(e.id.toString()) : self.selectionManager.set(e.id.toString()),
            d3.event.stopPropagation()
    },
    Timeline.prototype.getToolTipTitle = function(e) {
        var t = e.name;
        if (e.articleTotalInTimeColumn >= this.rowCount && e.timeRowIndex === this.rowCount) {
            var n = "+ " + e.articleTotalInTimeColumn + " addtional articles";
            return n
        }
        return t
    },
    Timeline.prototype.getToolTipBody = function(e) {
        return e.articleTotalInTimeColumn >= this.rowCount && e.timeRowIndex === this.rowCount ? "beginning " + e.date: e.date
    },
    Timeline.prototype.getLocatedArticles = function(e) {
        var t = this,
            n = [];
        return _.each(this.links,
            function(i) {
                i.target === e.id && "article" === t.nodes[i.source].type && n.push(i.source)
            }),
            n
    },
    Timeline.prototype.resize = function() {
        this.width = $(this.divName).width(),
            this.height = $(this.divName).height(),
            this.render()
    },
    Timeline.prototype.advanceTimeline = function(e) {
        this.timelineEmptyCells.selectAll("rect").attr("fill",
            function(t) {
                return t.x == e.x ? (self.activeColumn = e.x, "rgba(244, 244, 244, 0.7)") : "rgba(244, 244, 244, 0.3)"
            }),
            this.timelineGroup.selectAll("rect").filter(function(e) {
                return e.timeColIndex == self.activeColumn
            }).attr("stroke", "rgba(255, 255, 255, 1.0)").attr("stroke-width", "2").attr("stroke-linecap", "round"),
            this.timelineGroup.selectAll("rect").filter(function(e) {
                return e.timeColIndex != self.activeColumn
            }).attr("stroke", "rgba(0, 0, 0, 0.0)").attr("stroke-width", "0").attr("stroke-linecap", "round")
    };