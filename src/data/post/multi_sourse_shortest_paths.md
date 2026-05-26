---
publishDate: 2026-05-18T00:00:00Z
title: '多源最短路径'
excerpt: '算法导论第25章'
image: '../../assets/images/pagecover2.jpg'
---
# 多源最短路径
## 图的基本表示方法
邻接矩阵
$$
w_{ij}=w(i,j),i \neq j,(i,j)\in E
$$
$$
w_{ij}=0,i=j
$$
$$
w_{ij}=\infty,i \neq j,(i,j)\notin E
$$
### 前驱子图
* $\pi_{ij}$代表从源结点$i$到目标结点$j$路径上最后经过的一个结点
可以理解为$j$的直接父节点
* $\Pi$是一个大小为$V^{2}$的矩阵记录了所有的$\pi_{ij}$，其中第$i$行记录了以$i$为源点时，所有点的前驱结点，而这一行诱导出的子图就是以$i$为根的最短路径树，也叫做结点$i$的前驱子图$G_{\pi,i}$
* $G_{\pi,i}$代表一棵以$i$为根结点的最短路径树，具体可以写为$G_{\pi,i}=(V_{\pi,i},E_{\pi,i})$
其中有
$$
V_{\pi,i}=\{j\in V:\pi_{ij}\neq NIL\}\cup\{i\}
$$
$$
E_{\pi,i}=\{(\pi_{ij},j):j\in V_{\pi,i}-\{i\}\}
$$
```
print_all_pairs_shortest_path(PI,i,j)
if i==j
    print i
else if pi_{ij}==NIL
    print"no path from"i"to"j"exits"
else print_all_pairs_shortest_path(PI,i,pi_{ij})
    print j
```
```cpp
void printPath(const vector<vector<int>>& pi, int i, int j) {
    if (i==j) {
        cout << i;
    } 
    else if (pi[i][j]==-1) {
        cout << "no path from " << i << " to " << j << " exists";
    } 
    else {
        printPath(pi, i, pi[i][j]);
        cout << " -> " << j;
    }
}
```
这个打印父节点的算法后面会被extend-shortest-paths和Floyd-Warshall用到，作用是还原每条最短路径
## 使用V次Dijkstra算法
在学习完单源最短路径后，我们很容易想出用$|V|$次单源最短路径算法来求出所有结点对之间的最短路径，每一次使用不同的结点作为源结点。如果所有的权重为非负值，那么就可以使用Dijkstra，此时算法的时间复杂度为**单次Dijkstra的代价$\times|V|$**
### 使用线形数组实现最小优先队列
* 单次Dijkstra时间复杂度为$O(V^{2}+E)$
    *  $O(V^{2})$来自每次从未处理的节点中线形扫描找到最小值（每次至多扫描$|V|$个节点，一共处理$|V|$次）
    * $O(E)来自遍历所有边进行松弛$
* V次总时间为$O(V^{3}+VE)=O(V^{3})$其中$VE \leq V \times V^{2}=V^{3}$
### 使用二叉堆实现最小优先队列
* 单次Dijkstra时间复杂度为$O((V+E)lgV)$
  * 每次从堆中弹出最小元素:$O(lgV)$，共$V$次
  * 每次更新节点的距离(decrease-key):$O(lgV)$,共$E$次
* V次总时间为$O(V^{2}lgV+VElgV)$
  * 其中因为$E \geq V-1$,$VElgV$为主导项，所以最后可以被简化为$O(VElgV)$
### 使用斐波那契堆实现最小优先队列
* 单次Dijkstra时间复杂度为$O(VlgV+E)$
  * extract-min:$O(lgV)$,一共$V$次->$O(VlgV)$
  * decrease-key:摊还时间$O(1)$,一共$E$次->$O(E)$
* V次总时间为$O(V^{2}lgV+VE)$
## extend-shortest-paths
### 最短路径具有最优子结构
假定从$i$到$j$有一条最短路径$p$,$p$最多包含$m$条边
如果起点$i$和$j$不相同，且有$j$的前驱结点$k$，则最短路径可以被拆解为$\delta(i,j)=\delta(i,k)+w_{kj}$
其中从$i$到$k$至多包含$m-1$条边

注意，此时我们认为$k$是最短路径上$j$的前驱结点，可是我们一开始并不知道最短路径是那一条，所以对于$j$所有可能前驱$k$我们都需要进行检查来获得$l_{ij}^{(m)}$
我们可以得到：
$$
l_{ij}^{(m)}=min(l_{ij}^{(m-1)},\min\limits_{1\le k \le n}\{l_{ik}^{(m-1)}+w_{kj}\})=\min\limits_{1\le k \le n}\{l_{ik}^{(m-1)}+w_{kj}\}
$$
注意$k$是可以取到$j$的也就是说此时
$$
l_{ik}^{(m-1)}+w_{kj}=l_{ij}^{(m-1)}
$$
第二个等式自然成立
需要注意的是如果一共有$n$个结点，那么从$i$到$j$的简单路径上的边最多有$n-1$条，否则就会成环，只要这个环上的权重和不为负数，我们都可以通过删除这个环从而获得更小或者相等的路径权重和，因此，从$i$到$j$的多于$n-1$条边构成的路径不可能有比从$i$到$j$的最小路径权重更小的权重和
$$
\delta(i,j)=l_{ik}^{(n-1)}=l_{ik}^{(n)}=l_{ik}^{(n+1)}=...
$$
### 伪代码(只涉及$L$和上一轮$L'$的递推关系，至于怎么快速求得$L^{(n-1)}$需要用重复平方)
```
extend_shortest_paths(L,W)
n=L.rows
let L'=(L_{ij}')be a new n*n matrix
for i=1 to n
    for j=1 to n
        l_{ij}'=infinite
        for k=1 to n
            l_{ij}'=min(l_{ij}',l_{ik}+w_{kj})
    
```
不难看出算法的时间复杂度为$O(n^{3})$
对于矩阵乘法有：
$C=A \times B$
$A,B$都是$n\times n$的方阵
$c_{ij}=\sum\limits_{k=1}^{n}a_{ik}\cdot b_{kj}$
书上的算法：
$l_{ij}^{(m)}=\min\limits_{1\le k \le n}\{l_{ik}^{(m-1)}+w_{kj}\}$
书上也提到这种算法和矩阵乘法很像，对于这个算法里进行的所有运算都可以一一映射到矩阵乘法中的运算：
$ l^{m-1} \to a $
$ w\to b$
$ l^{m} \to c$
$min \to +$
$ + \to \cdot $
那这是不是意味着这种算法也满足矩阵乘法的一些基本定律呢？
比如说结合律？
答案是这种算法也满足结合律，有了这条性质，加上我们之前已经验证过的性质
$$
\delta(i,j)=l_{ik}^{(n-1)}=l_{ik}^{(n)}=l_{ik}^{(n+1)}=...
$$
使得我们可以利用**重复平方**来加速计算
定义 $\otimes\ $为 min-plus 矩阵乘法：
$$
(L \otimes W)_{ij} = \min\limits_{1 \le k \le n}( L_{ik} + W_{kj})
$$
$$
L^{(1)}=L^{(0)}\otimes W=W
$$
$$
L^{(2)}=L^{(1)}\otimes W=W^{2}
$$
$$
···
$$
$$
L^{(n-1)}=L^{(n-2)} \otimes W=W^{n-1}
$$
对于**重复平方**：
$$
L^{(2m)}=L^{(m)} \otimes L^{(m)}=W^{2m}
$$
当$2m > n-1$时$L^{(2m)} = L^{(n-1)}$
最少经过$\lceil log_{2}^{n-1} \rceil$次平方达到$L^{(n-1)}$
### 伪代码(没有重复平方版)
```
slow_all_pairs_shortest_paths(W)
n=W.rows
L^{(1)}=W
for m=2 to n-1
    let L_{(m)}be a new n*n matrix
    L^{(m)}=extend_shortest_paths(L^{(m-1)},W)
return L^{(n-1)}
```
时间复杂度：$O(n^{4})$
### 伪代码(重复平方优化)
```
faster_all_pairs_shortest_paths(W)
n=W.rows
L^{(1)}=W
m=1
while m<n-1
    let L^{(2m)} be a new n*n matrix
    L^{(2m)}=extend_shortest_paths(L^{(m)},L^{(m)})
    m=2m
return L^{(m)}
```
时间复杂度：$O(\lceil log_{2}^{n-1} \rceil \cdot n^{3})$
一些不太重要的想法：为什么是平方？
因为min-plus矩阵乘法一次性只能处理两个矩阵
### cpp代码实现
```cpp
#include<iostream>
#include<vector>
#include<climits>
#include<sstream>
using namespace std;

const int INF = INT_MAX;

vector<vector<int>> extend_shortest_paths(const vector<vector<int>>& L1,const vector<vector<int>>& L2,vector<vector<int>> &P){
    int n = L2.size();
    vector<vector<int>> L_new (L1) ;
    for(int i=0;i<n;i++){
        for(int j=0;j<n;j++){
            for(int k=0;k<n;k++){
                if(L1[i][k]!=INF && L2[k][j]!=INF){
                    if(L_new[i][j] > L1[i][k] + L2[k][j]){
                        L_new[i][j] = L1[i][k] + L2[k][j];//不可以原地修改，L_new依赖上一轮的L[i][k]，也就是说i,j之间的最小权重和还会再变
                        P[i][j]=P[k][j];//注意不要直接写成k,因为k可能不是直接j的前驱结点
                    }
                }
            }
        }
    }
    return L_new;
}

vector<vector<int>> slow_all_shortest_paths(const vector<vector<int>>& W,vector<vector<int>>&P){
    int n = W.size();
    vector<vector<int>> L = W;
    int m=1;
    while(m<n-1){
        L=extend_shortest_paths(L,L,P);
        m=2*m;
    }
    return L;
}

void printPath(const vector<vector<int>>& pi, int i, int j) {
    if (i==j) {
        cout << i;
    } 
    else if (pi[i][j]==-1) {
        cout << "no path from " << i << " to " << j << " exists";
    } 
    else {
        printPath(pi, i, pi[i][j]);
        cout << " -> " << j;
    }
}
int main(){
    int n;
    if(!(cin>>n)) return 0;
    cin.ignore();

    int u,v,w;
    string line;
    vector<vector<int>> W(n, vector<int>(n, INF));

    for(int t=0;t<n;t++){
        W[t][t] = 0;
    }

    while(getline(cin,line)){
        if(line.empty()) break;
        stringstream ss(line);
        while(ss>>u>>v>>w){
            W[u][v] = w;
        }
    }

    vector<vector<int>> P (n,vector<int>(n,-1));
    for (int i=0;i<n;i++) {
        for (int j=0;j<n;j++) {
            if (i!=j && W[i][j]!=INF) {
                P[i][j]=i;
            }
        }
    }

    vector<vector<int>> L = slow_all_shortest_paths(W,P);

    for(int i=0;i<n;i++){
        for(int j=0;j<n;j++){
            if(L[i][j]==INF) cout<<"I"<<" ";
            else cout<<L[i][j]<<" ";
        }
        cout<<endl;
    }
    cout<<endl;
    for(int i=0;i<n;i++){
        for(int j=0;j<n;j++){
            if(P[i][j]==INF) cout<<"I"<<" ";
            else cout<<P[i][j]<<" ";
        }
        cout<<endl;
    }
    cout<<endl;
    printPath(P,0,n-1);
    
}
```
需要注意的是，在重复平方中由于我们使用的是$L\otimes L$,而非$L \otimes W$,此时$L[k][j]$不是像$W[k][j]$一样的单步边权，而是从$k$到$j$的最短路径长度，所以可能经过多个中间结点，**在更新$j$的直接前驱结点时，不能写$k$,而需要写成$P[k][j]$**
## Floyd-Warshall 算法
与考虑最多需要多少步可以到达的extend-shortest-paths不同，Floyd-Warshall 考虑的是一条最短路径上的**中间结点**
### 最短路径的结构
假定图$G$的所有结点为$V=\{1,2,...,n\}$，其中的一个子集$\{1,2,...,k\}$,这里的$k$是某个小于$n$的整数。对于任意结点对$i,j \in V$,考虑从结点$i$到$j$所有中间结点都取自集合$\{1,2,...,k\}$的路径，并设$p$为其中权重最小的简单路径。下面给出最短路径$p$和$k$的关系
* 如果结点$k$不是路径$p$上的中间结点，则路径$p$上的所有中间结点都属于集合$\{1,2,...,k-1\}$。因此，从结点$i$到$j$的中间结点取自$\{1,2,...,k-1\}$的一条最短路径也是从结点$i$到$j$的中间结点取自$\{1,2,...,k\}$的一条最短路径
* 如果结点$k$是路径$p$上的中间结点，则可以将路径$p$分解为从$i$到$k$的最短路径$p1$,和从$k$到$j$的最短路径$p2$,其中$p1$和$p2$的所有中间结点都取自$\{1,2,...,k-1\}$（如果$p1$或者$p2$上还有中间结点$k$的话，就会形成一个环，在我们默认不存在权重和为负值的环的前提下，我们可以通过删除环使得路径上的权重和减小，但是这与$p1$和$p2$已经是最短路径的前提矛盾，所以中间结点不可能出现$k$）

若写成公式的话可以有：
$$
d_{ij}^{(k)} = 
\begin{cases} 
w_{ij}, & \text{if } k = 0 \\[4pt]
\min\left(d_{ij}^{(k-1)}, \; d_{ik}^{(k-1)} + d_{kj}^{(k-1)}\right), & \text{if } k \ge 1 
\end{cases}
$$
因为对于所有路径来说，所有的中间结点都属于集合$\{1,2,...,n\}$，所以矩阵$D^{(n)}=(d_{ij}^{(n)})$就是我们需要求出的最后答案
### 伪代码
```
floyd-warshall(W)
n=W.rows
D^(0)=W
for k=1 to n
    let D^{(k)}be a new n*n matrix
    for i=1 to n
        for j=1 to n
            d_{ij}^{(k)}=min(d_{ij}^(k-1),d_{ik}^{(k-1)}+d_{kj}^{(k-1)})
return D^{(n)}
```
### cpp代码实现
```cpp
#include<iostream>
#include<vector>
#include<sstream>
#include<climits>
#include<algorithm>
using namespace std;
void printPath(const vector<vector<int>>& pi, int i, int j) {
    if (i==j) {
        cout << i;
    } 
    else if (pi[i][j]==-1) {
        cout << "no path from " << i << " to " << j << " exists";
    } 
    else {
        printPath(pi, i, pi[i][j]);
        cout << " -> " << j;
    }
}
vector<vector<int>> floyd_warshall(const vector<vector<int>>& W,vector<vector<int>>&P){
    int n=W.size();
    vector<vector<int>>D(W);//通过0个中间结点到达需要的通过的距离
    for(int k=0;k<n;k++){//中间结点可取0,1,2,3...k
        for(int i=0;i<n;i++){
            for(int j=0;j<n;j++){
                if(D[i][k]!=INT_MAX && D[k][j]!=INT_MAX){
                    if(D[i][j]>D[i][k]+D[k][j]){
                        D[i][j]=D[i][k]+D[k][j];
                        /*
                        可以原地修改，因为对于当前k而言，
                        本轮循环的目的是求出中间结点为1,2...k的最短路径
                        所以D[i][k]和D[k][j]不会在本轮中被修改
                        (不可能存在以i为起点k为终点,
                        同时以k作为中间结点的更短路径
                        ,因为这样就成环了,
                        同理也不可能存在
                        以k为起点j为终点
                        的更短路径)
                        */
                        P[i][j]=P[k][j];
                    }
                }
            }
        }
    }
    return D;
}
int main(){
    int n;
    if(!(cin>>n)) return 0;
    cin.ignore();
    int u,v,w;
    string line;
    vector<vector<int>> W(n, vector<int>(n, INT_MAX));
    for(int t=0;t<n;t++){
        W[t][t] = 0;
    }
    while(getline(cin,line)){
        if(line.empty()) break;
        stringstream ss(line);
        while(ss>>u>>v>>w){
            W[u][v] = w;
        }
    }

    vector<vector<int>> P (n,vector<int>(n,-1));
    for (int i=0;i<n;i++) {
        for (int j=0;j<n;j++) {
            if (i!=j && W[i][j]!=INT_MAX) {
                P[i][j]=i;
            }
        }
    }

    vector<vector<int>> D = floyd_warshall(W,P);
    for(int i=0;i<n;i++){
        for(int j=0;j<n;j++){
            if(D[i][j]==INT_MAX) cout<<"I"<<" ";
            else cout<<D[i][j]<<" ";
        }
        cout<<endl;
    }
    cout<<endl;
    for(int i=0;i<n;i++){
        for(int j=0;j<n;j++){
            if(P[i][j]==INT_MAX) cout<<"I"<<" ";
            else cout<<P[i][j]<<" ";
        }
        cout<<endl;
    }
    cout<<endl;
    printPath(P,0,n-1);
}
```
不难看出这个算法的时间复杂度由三层嵌套循环决定，所以为$\Theta(n^{3})$
在构建矩阵$D^{(k)}$的同时，我们还需要维护前驱结点矩阵$\Pi^{(k)}$,对于每个结点对$i,j$有：
$$
\pi_{ij}^{(k)} = 
\begin{cases} 
\pi_{ij}^{(k-1)}, & \text{if } d_{ij}^{(k-1)} \le d_{ik}^{(k-1)} + d_{kj}^{(k-1)} \\[4pt]
\pi_{kj}^{(k-1)}, & \text{if } d_{ij}^{(k-1)} > d_{ik}^{(k-1)} + d_{kj}^{(k-1)}
\end{cases}
$$
### 有向图的闭包传递
我们希望判断在有向图$G$中是否又一条从$i$到$j$的路径
* 利用floyd-warshall算法
  * 将$E$中的每条边赋予权重1，然后运行floyd-warshall算法。如果存在一条从$i$到$j$的路径，则有$d_{ij}<n$;否则$d_{ij}=\infty$，时间复杂度为$O(n^{3})$
* 通过逻辑与和逻辑或代替floyd-warshall算法中$min$和$+$操作
  * 我们定义如果有向图$G$中是否又一条从$i$到$j$的路径，且所有中间结点都取自集合$\{1,2,...,k\}$
    则$t_{ij}^{(n)}=1$,否则$t_{ij}^{(n)}=0$
    对于$k\geq 1$:
    $$
    t_{ij}^{(k)}=t_{ij}^{(k-1)}\lor(t_{ik}^{(k-1)}\land t_{kj}^{(k-1)})
    $$
    该算法的时间复杂度同floyd-warshall
#### cpp实现
```cpp
#include<iostream>
#include<vector>
#include<sstream>
using namespace std;
vector<vector<bool>> floyd_warshall(const vector<vector<bool>>& E){
    int n=E.size();
    vector<vector<bool>>T(E);
    for(int k=0;k<n;k++){
        for(int i=0;i<n;i++){
            for(int j=0;j<n;j++){
                T[i][j]=T[i][j]||(T[i][k]&&T[k][j]);
            }
        }
    }
    return T;
}
int main(){
    int n;
    if(!(cin>>n)) return 0;
    cin.ignore();
    int u,v;
    string line;
    vector<vector<bool>> E(n, vector<bool>(n, 0));//两个结点有边相连就为1，否则为0
    for(int t=0;t<n;t++){
        E[t][t] = 1;
    }
    while(getline(cin,line)){
        if(line.empty()) break;
        stringstream ss(line);
        while(ss>>u>>v){
            E[u][v] = 1;
        }
    }

    vector<vector<bool>> T = floyd_warshall(E);
    for(int i=0;i<n;i++){
        for(int j=0;j<n;j++){
            cout<<T[i][j]<<" ";
        }
        cout<<endl;
    }
}
```
## 用于稀疏图的Johnson算法
Johnson算法可以在$O(V^{2}lgV+VE)$时间内找到所有结点对之间的最短路径（和之前说过的$V$次用斐波那契堆排序的Dijkstra算法代价相同）。对于稀疏图来说$E$渐进于$V-1$,所以Johnson的渐进表现优于重复平方法和Floyd-Warshall。Johnson算法使用Dijkstra和Bellman-Ford作为自己的子程序，所以Johnson算法要么返回一个包含所有结点对的最短路径权重的矩阵，要么报告输入图包含一个权重为负值的环路

一般对图来说，像Bellman-Ford一样暴力地遍历$V-1$次边集是不太划算的，因此我们更希望采用更高效的Dijkstra算法，但是Dijkstra无法处理含有权重为负的边的图，所以，Johnson算法通过重新赋予权重，使得所有边权重$w$都为非负值，这样我们就可以通过对每个结点运行一次Dijkstra来找到所有结点对之间的最短路径，我们设$\hat{w}$为新赋予的权重，这个权重必须满足下面**两个重要性质**：
**1. 对于所有的结点对$u,v\in V$，一条路径$p$是在使用权重函数$w$时从$u$到$v$的一条最短路径当且仅当$p$是在使用权重函数$\hat{w}$时从$u$到$v$的一条最短路径
2. 对于所有的边$(u,v)$,新权重$\hat{w}(u,v)$非负**
### 证明性质一
那么，下面展示我们具体是如何重新赋予权重的：
我们使用$\delta$表示从权重函数$w$所导出的最短路径权重，而用$\hat{\delta}$表示权重函数$\hat{w}$所导出的最短路径权重
> 定义$\hat{w}(u,v)=w(u,v)+h(u)-h(v)$
> 设$p=<v_{0},v_{1},...,v_{k}>$是在使用权重函数$w$时从结点$v_{0}$到$v_{k}$的一条最短路径当且仅当$p$是在使用$\hat{w}$时从结点$v_{0}$到$v_{k}$的一条最短路径
> 在使用权重函数$w$不包含权重为负值的环路，当且仅当$p$在使用$\hat{w}$时不包括权重为负值的环路

下证：
$$
\hat{w}(p)=w(p)+h(v_{0})-h(v_{k})
$$
$$
\hat{w}(p) = \sum_{i=1}^k \hat{w}(v_{i-1}, v_i) 
$$
$$
= \sum_{i=1}^k \bigl( w(v_{i-1}, v_i) + h(v_{i-1}) - h(v_i) \bigr)
$$
$$
= \sum_{i=1}^k w(v_{i-1}, v_i) + h(v_0) - h(v_k) \qquad (\text{裂项相消})
$$
$$
= w(p) + h(v_0) - h(v_k)
$$
由于$h(v_0) ,h(v_k)$不依赖于任何具体的路径，所以从结点$v_{0}$到$v_{k}$的一条路径在使用权重函数$w$时比另一条路径短，则其在使用$\hat{w}$时也比另一条路径短（你可以理解为现在和原先的权重和相比只相差了一个常数，但是不同路径的权重和的相对关系依然不变）
**所以 $w(p)=\delta(v_0,v_k)$当且仅当$\hat{w}(p)=\delta(v_0,v_k)$**
最后我们还需要证明在使用权重函数$w$包含权重为负值的环路，当且仅当$p$在使用$\hat{w}$时包括权重为负值的环路。考虑任意环路$c=<v_{0},v_{1},...,v_{k}>$,其中$v_0=v_k$,所以$\hat{w}(c)=w(c)+h(v_0)-h(v_k)=w(c)$,因为$w(c)\leq 0$所以$\hat{w}(c)\leq 0$,证毕
### 证明性质二
我们定义对于所有的结点$v\in V'$,$h(v)=\delta(s,v)$由三角不等式可知$
h(v)\leq h(u)+w(u,v)$ , 因此 
$\hat{w}(u,v)=w(u,v)+h(u)-h(v)\geq 0$,满足性质二
### Johnson伪代码
```
Johnson(G,w)
compute G',where G'.V=G.V and {s},G'.E=G.E and {(s,v):v in G.V},w(s,v)=0 for all v in G.V
if Bellman-Ford(G',w,s)==False
    print"the input graph contains a negative-weight cycle"
else for each vertex v in G'.V
    set h(v) to the value of delta(s,v)compute by the Bellman-Ford algorithm
    for each edge(u,v) in G'.V
        hat{w}(u,v)=w(u,v)+h(u)-h(v)
        let D=(d_{uv}) be a new n*n matrix
        for each vertex u in G.V
            run Dijkstra(G,hat{w},u) to compute hat{delta}(u,v) for all v in G.V
            for each vertex v in G.V
                d_{uv}=hat{delta}(u,v)+h(v)-h(u)
    return D
```
### cpp实现
```cpp
#include<vector>
#include<iostream>
#include<sstream>
#include<climits>
#include<queue>
using namespace std;
class Edge{
public:
    int u;
    int v;
    int weight;
public:
    Edge(int u, int v, int weight){
        this->u = u;
        this->v = v;
        this->weight = weight; 
    }
   
};
void Relax(Edge e,vector<int> & distance){
    if(distance[e.u]!=INT_MAX&&distance[e.v]>distance[e.u]+e.weight){
        distance[e.v]=distance[e.u]+e.weight;
    }
}
bool Bellman_ford(const vector<Edge>&edges,int V,vector<int>&distance){
for(int i=1;i<V;i++){
    for(Edge e:edges){
        Relax(e,distance);
    }
}
for(Edge e:edges){
    if(distance[e.v]>distance[e.u]+e.weight){
        return false;
    }
}
return true;
}//Bellman_ford用于计算h(u)
void Relax(int u,int v,int weight,vector<int> & distance){
    if(distance[u]!=INT_MAX&&distance[v]>distance[u]+weight){
        distance[v]=distance[u]+weight;
        
    }
}
struct compare
{
    bool operator()(const pair<int,int> &V1,const pair<int,int>&V2){
        return V1.first>V2.first;
    }
};

void Dijkstra(int s,const vector<vector<int>> & W,vector<int> & distance){
    int V=W.size();
    using P=pair<int,int>;//distance[u],u
    priority_queue<P,vector<P>,compare>Q;
    Q.push({0,s});
    while(!Q.empty())
    {   
        auto [d,u]=Q.top();
        Q.pop();
        if (d > distance[u]) continue;//旧记录无效时跳过，始终以 distance[u] 的最新值为准
        for(int v=0;v<V;v++){
            int w=W[u][v];//取出邻接结点的权重
            if(w==INT_MAX) continue;//防止溢出
            if(distance[v]>distance[u]+w){
                Relax(u,v,w,distance);
                Q.push({distance[v],v});
            }
        }
        //可以理解为Dijkstra返回的是新的distance数组,代表从源结点S到其他结点的最小距离和
    }
}
vector<vector<int>> Johnson(vector<Edge>&edges,int V){
    vector<int>h(V+1,INT_MAX);//因为加入了S结点，所以总共有V+1个结点
    h[V]=0;//指定源S为第V+1个结点，距离为0，其他则为INT_MAX；
    vector<Edge>new_edges_for_bellman(edges);
    for(int i=0;i<V;i++){
        new_edges_for_bellman.push_back(Edge(V,i,0));//加入V条与结点S相连的边
    }

    if(!Bellman_ford(new_edges_for_bellman,V+1,h)){
        throw "存在权重和为负值的环";
    }

    else{
        for(Edge &e:edges){
             e.weight=e.weight+(h[e.u]-h[e.v]);//改写权重，使得weight>=0
        }

        vector<vector<int>>W_new(V,vector<int>(V,INT_MAX));//初始化改写的权重矩阵,用于Dijkstra
        for(Edge e:edges){
           W_new[e.u][e.v]=e.weight;//改写用于表示边的数据结构，将边的集合改写为邻接权重矩阵
        }
        for(int i=0;i<V;i++){
            W_new[i][i]=0;
        }

        vector<vector<int>>D(V,vector<int>(V));//用于存储任意两结点对的最短距离

        for(int i=0;i<V;i++){
            vector<int>distance(V,INT_MAX);
            distance[i]=0;//以i为源结点的路径
            Dijkstra(i,W_new,distance);//distance代表以i为源结点的最小路径树
            for(int j=0;j<V;j++){
                if(distance[j]!=INT_MAX)D[i][j]=distance[j]+h[j]-h[i];//将路径权重和改写回来
                else D[i][j]=INT_MAX;//改写权重后不可到达的结点在原来没改写时也是不可到达的
            }
        }
        
        return D;
    }
}
int main(){
    int V;
    cin>>V;
    cin.ignore();
    vector<Edge>edges;//适应bellman的数据结构，在Johnson内部会改写为邻接矩阵，记录的是权重
    string line;
    int u,v,weight;
    while(getline(cin,line)){
        if(line.empty())break;
        stringstream ss(line);
        ss>>u>>v>>weight;
        edges.push_back(Edge(u,v,weight));
    }
    try{
        vector<vector<int>>D(Johnson(edges,V));
        for(int i=0;i<V;i++){
            for(int j=0;j<V;j++){
                if(D[i][j]==INT_MAX) cout<<"I"<<" ";
                else cout<<D[i][j]<<" ";
            }
            cout<<endl;
        }
    }
    catch(const char* e){
        cout<<*e<<endl;
    }
}
```
