(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const i of t.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function o(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function r(e){if(e.ep)return;e.ep=!0;const t=o(e);fetch(e.href,t)}})();let l=3,c={};const m=document.getElementById("start"),f=document.getElementById("generate"),u=document.getElementById("output");let a=document.getElementById("ngrams").checked;const g=document.getElementById("save"),h=document.getElementById("record"),d=document.getElementById("rightIcon");document.getElementById("leftIcon");function p(){let n=document.getElementById("fix").value;h.innerHTML+="<br>"+n,d.src="../src/icons/robotIcon.png"}function y(){fetch("https://poetrydb.org/author,title/Shakespeare;Sonnet").then(n=>n.json()).then(n=>{n.forEach(s=>{s.lines.forEach(o=>{if(o=o.toLowerCase().replace(/["'`,!?;.:]/g,""),!!o&&a)for(let r=0;r<o.length-l;r++){let e=o.substring(r,r+3);c[e]||(c[e]=[]),c[e].push(o.charAt(r+l))}})}),console.log(c)}).catch(n=>console.log(n))}function I(){a&&(b(),d.src="../src/icons/humanIcon.png")}function b(){let n,s=Object.keys(c);for(let o=0;o<4;o++){o==0?n=document.getElementById("prompt").value.substring(0,l):n=s[Math.floor(Math.random()*s.length)];let r=n;for(let e=0;e<50;e++){let t=c[n];if(!t)break;let i=t[Math.floor(Math.random()*t.length)];r+=i,n=r.substring(r.length-l,r.length)}u.innerHTML+="<br>"+r}u.innerHTML+="<br/><br><strong>What does that make you think about?"}m.addEventListener("click",y);f.addEventListener("click",I);g.addEventListener("click",p);
