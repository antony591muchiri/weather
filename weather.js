(function(){
  var SYM={'+':'+','-':'−','*':'×','/':'÷'};
  var cur='0',prev=null,op=null,fresh=false,expr='';
  var elV=document.getElementById('value'),elE=document.getElementById('expr');

  function fmt(n){
    if(!isFinite(n))return 'Error';
    return String(parseFloat(n.toPrecision(12)));
  }
  function group(s){
    if(s==='Error'||s.indexOf('e')>-1)return s;
    var neg=s[0]==='-'; if(neg)s=s.slice(1);
    var p=s.split('.'); p[0]=p[0].replace(/\B(?=(\d{3})+(?!\d))/g,',');
    return (neg?'-':'')+p.join('.');
  }
  function calc(a,b,o){
    if(o==='+')return a+b; if(o==='-')return a-b; if(o==='*')return a*b;
    return b===0?NaN:a/b;
  }
  function render(){
    var t=group(cur);
    elV.textContent=t; elE.textContent=expr;
    elV.style.fontSize=Math.max(26,Math.min(52,300/Math.max(t.length,1)*1.45))+'px';
    document.querySelectorAll('.op').forEach(function(b){
      b.classList.toggle('on',!!op&&fresh&&b.dataset.k===op);
    });
  }
  function reset(){cur='0';prev=null;op=null;fresh=false;expr='';}
  function press(k){
    if(cur==='Error'&&k!=='clear'){reset();}
    if(/^\d$/.test(k)){
      if(fresh){cur='0';fresh=false;}
      if(cur==='0')cur=k; else if(cur.replace(/[-.]/g,'').length<15)cur+=k;
    }else if(k==='.'){
      if(fresh){cur='0';fresh=false;}
      if(cur.indexOf('.')<0)cur+='.';
    }else if(k==='clear'){reset();
    }else if(k==='sign'){
      if(cur!=='0')cur=cur[0]==='-'?cur.slice(1):'-'+cur;
    }else if(k==='pct'){
      cur=fmt(parseFloat(cur)/100);
    }else if(k==='back'){
      if(fresh)return;
      cur=(cur.length>1&&!(cur.length===2&&cur[0]==='-'))?cur.slice(0,-1):'0';
    }else if(k==='='){
      if(!op)return;
      var b=parseFloat(cur),r=calc(prev,b,op);
      expr=fmt(prev)+' '+SYM[op]+' '+fmt(b)+' =';
      cur=fmt(r);prev=null;op=null;fresh=true;
    }else if(SYM[k]){
      if(op&&!fresh){prev=calc(prev,parseFloat(cur),op);cur=fmt(prev);if(cur==='Error'){op=null;prev=null;render();return;}}
      else if(!op){prev=parseFloat(cur);}
      op=k;fresh=true;expr=fmt(prev)+' '+SYM[k];
    }
    render();
  }
  document.getElementById('keys').addEventListener('click',function(e){
    var b=e.target.closest('button'); if(b)press(b.dataset.k);
  });
  document.addEventListener('keydown',function(e){
    if(e.ctrlKey||e.metaKey||e.altKey)return;
    var k=e.key,m=null;
    if(/^\d$/.test(k)||k==='.')m=k;
    else if(k===','){m='.';}
    else if('+-*/'.indexOf(k)>-1)m=k;
    else if(k==='x'||k==='X')m='*';
    else if(k==='Enter'||k==='='){m='=';e.preventDefault();}
    else if(k==='Backspace')m='back';
    else if(k==='Escape'||k==='c'||k==='C')m='clear';
    else if(k==='%')m='pct';
    if(m){ if(k==='/')e.preventDefault(); press(m); }
  });
  render();
})();