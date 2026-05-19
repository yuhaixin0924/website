---
title: '最小生成树'
description: '我的第一篇文章。'
pubDate: '2026-05-18'
heroImage: '../../assets/blog-pagecover.jpg'
---
# 最小生成树

## 23.1 最小生成树的形成

### 引言
顾名思义，最小生成树是在可以到达图的所有结点的前提下，通过算法合理选择边，使得被选择的边形成一棵无环树，同时边权重和最小。

### 贪心算法正确性证明
证明：

$$
A \text{ 是最小生成树的边集合}
$$

在每次循环之后，$A$ 是某棵最小生成树的一个子集。

#### 伪代码
```
generic_mst(g,w)//w是权重函数
A = \emptyset;
while A does not form a spanning tree
    find an edge(u,v)that is safe for A
    A = A \cup \{(u,v)\}
return A
```

#### 1.初始化
$A$ 为空，一定是最小生成树的子集。

#### 2.保持
加入安全边保证新增边一定是最小生成树的一部分，进而 $A$ 还是最小生成树的子集。

#### 3.终止
$|V|-1$ 条边都被加入 $A$（$A$ 为 spanning tree 的边集合），结束循环；又因为 $A$ 中所有的边都属于某棵最小生成树，因此 $A$ 也是最小生成树。

**问题来了，怎么找到安全边？**

-------

什么是**横跨切割边**：
即一个端点位于集合 $S$，另一个端点位于 $V \setminus S$ 的边。
下图中 $A$ 不存在横跨切割边，所以说该切割**尊重集合 $A$**。在横跨切割边中，权重最小的为轻量级边，下图中 $(b,c)$ 和 $(h,a)$ 都是轻量级边。

![图](http://www.brokenvase.top/wp-content/uploads/2026/04/1777201716-151.png)

> **定理23.1**
> **如果 $(S, V \setminus S)$ 是图 $G$ 中尊重集合 $A$ 的任意一个切割，又设 $(u, v)$ 是横跨切割 $(S, V \setminus S)$ 的一条轻量级边，那么边 $(u, v)$ 对于 $A$ 是安全的**

#### 证明
设 $T$ 是一棵包括 $A$ 的最小生成树
1. $T$ **包含**轻量级边 $(u,v)$，说明 $A$ 在加入 $(u,v)$ 后 **还是 $T$ 的子集**，证毕
2. $T$ **不包含**轻量级边 $(u,v)$，现在构建**另一棵最小生成树 $T'$**。若证明 $A \cup \{(u,v)\}$ 在 $T'$ 中，则边 $(u,v)$ 对于 $A$ 是安全的

下面证明 $A \cup \{(u,v)\}$ 在 $T'$ 中：
首先，因为树 $T$ 中任意两点之间**有且仅有一条简单路径**。当你添加一条不在 $T$ 中的边 $(u,v)$ 后，这条边与 $T$ 中原本存在的唯一简单路径 $p$ 就会恰好形成一个环路。
又因为 $u$ 和 $v$ 分别在 $S$ 和 $V \setminus S$ 中，$T$ 中至少会有一条边属于简单路径 $p$ 并且横跨该切割。
设 $(x,y)$ 是这样的一条边，因为切割 $(S, V-S)$ 尊重 $A$，边 $(x,y)$ 不在集合 $A$ 中。由于边 $(x,y)$ 位于 $T$ 中从 $u$ 到 $v$ 的唯一简单路径上，删除 $(x,y)$ 会导致 $T$ 被分为两个连通分量。
将 $(u,v)$ 加上去可以将这两个连通分量连接起来形成一棵新生成树：
$$T' = T - \{(x,y)\} \cup \{(u,v)\}$$
下面证明 $T'$ 是一棵最小生成树。由于 $(u,v)$ 是横跨切割的一条轻量级边，并且 $(x,y)$ 也横跨该切割，所以有 $w(u,v) \leq w(x,y)$。
所以：
$$w(T') = w(T) - w(x,y) + w(u,v) \leq w(T)$$
由于 $T$ 也是一个最小生成树，所以有 $w(T) \leq w(T')$，结合两式，$w(T) = w(T')$，所以 $T'$ 也是最小生成树，$(u,v)$ 是 $T'$ 中的一条边。
下面还需证明 $A$ 也属于 $T'$。
因为 $A \subseteq T$ 并且 $(x,y) \notin A$，所以有 $A \subseteq T'$。
**综上，$A \cup \{(u,v)\} \subseteq T'$ 证毕**

-------

直观上来理解的话，就是通过切割使 $A$ 可被视为**两个不相连的边集合**，这两个不相连的边集合可以包含多个连通分量（树），在切割边中找到一个**权重最小**生成的边使其**连接两个不相连的边集合**，避免了在选边加入 $A$ 时成环（比如在同一个连通分量中选择两个已经被选择过的点作为新加入边的端点），同时使得当前的局部选择最优（因为是轻量级边，权重最小）。

-------
不难发现：
找安全边的核心原则就有两条：
1. **不能成环**，所以连接的一定是两个不同的树
2. **局部选择最优**，选择连接两个不同的树的权重最小边 
当然这只是个人理解，可能有误

----

书上也补充到，由于 $A \cup \{(u,v)\}$ 必须是无环的，而且 $G_A = \{(V, A)\}$ 是一个森林，$G_A$ 的每个连通分量为一棵树（某些树可能只包含一个结点），所以对于集合 $A$ 而言安全的边所连通的是 $G_A$ 不同的连通分量，保证了不会成环。
每次循环将 $G_A$ 中的树减少一棵，当循环执行 $|V|-1$，整个森林只剩下一棵树。

> **推论23.2**
> **设 $G=(V,E)$ 是一个连通无向图，并有定义在集合 $E$ 上的实数值权重函数 $w$，设集合 $A$ 为 $E$ 的一个子集，且该子集包括在 $G$ 的某棵最小生成树里，并设 $C=(V_c, E_c)$ 为森林中连通分量。如果边 $(u,v)$ 是连接 $C$ 和 $G_A$ 中某个其他连通分量的一条轻量级边，则边 $(u,v)$ 对于集合 $A$ 是安全的**
 
## 23.2 Kruskal算法和Prim算法
对于 Kruskal 而言，集合 $G_A$ 是一个森林，在最开始时 $C$ 中每个结点就是 $G_A$ 的一棵树。每次加入集合 $A$ 中的都是权重最小的连接两个不同分量的边。而在 Prim 算法中，集合 $A$ 是一棵树，每次加入到 $A$ 中的边都是连接 $A$ 和 $A$ 之外的某个结点中权重最小的边。如果更直白一点，Kruskal 是选边，Prim 则是选点。
### Kruskal算法
在连接森林中两棵不同的树的边里面，找到权重最小的边 $(u,v)$。
显然这是贪心算法，因为每次都选择一个权重最小的边加入森林
我们使用一个不相交集合数据结构来维护几个不相交的元素集合，每个集合代表森林中的一棵树
#### 伪代码
```
mst_kruskal(G,w)
A = \emptyset
for each vertex v:G.V
    make_set(v)
sort the edges of G.E into nondecreasing order by weight w
for each edge(u,v):G.E,taken in nondecreasing order by weight
    if find_set(u)!=find_set(v)
        A = A \cup \{(u,v)\}
        union(u,v)
return A
```
#### C++实现：
```cpp
#include<iostream>
#include<vector>
#include<string>
#include<sstream>
#include<algorithm>
using namespace std;
class Disjoint_set_union{
public:
    vector<int>parent;
    vector<int>rank;
public:
    Disjoint_set_union(int V){
        parent.resize(V);
        rank.resize(V);
        for(int i=0;i<V;i++){
            parent[i]=i;
            rank[i]=0;
        }
    }
    int Find(int u){
        if(parent[u]!=u){
            parent[u]=Find(parent[u]);
        }
        return parent[u];
    }
    void Union(int u,int v){
        int root_1=Find(u);
        int root_2=Find(v);
        if(root_1==root_2){
            return;
        }
        else{
            if(rank[root_1]==rank[root_2]){
                rank[root_2]++;//谁做根结点谁的秩加1
                parent[root_1]=root_2;
            }
            else if(rank[root_1]>rank[root_2]){
                parent[root_2]=root_1;
            }
            else{
                parent[root_1]=root_2;
            }
        }
    }
};
class Edge
{
public:
    int u;
    int v;
    int weight;
public:
    Edge(int u,int v,int weight){
        this->u=u;
        this->v=v;
        this->weight=weight;
    }
    bool operator<(const Edge&other) const{
        return weight < other.weight;
    }//运算符重载用于排序
    void display(){
        cout<<u<<"----"<<weight<<"----"<<v<<endl;
    }
};

class Graph{
public:
    vector<Edge>E;
    int V;//顶点数
    
public:
    Graph(const vector<Edge>&other,int v):V(v){
        E=other;
    }
    void sort_by_weight(){
        sort(E.begin(),E.end());
    }
};
vector<Edge> kruskal(Graph& G){
    vector<Edge>A;//最小生成树子集
    Disjoint_set_union T(G.V);//初始化森林
    G.sort_by_weight();//按权重排序
    for(Edge e:G.E){
        if(T.Find(e.u)!=T.Find(e.v)){//如果边的两个端点不在同一集合(不形成环)
            A.push_back(e);//将边加入MST
            T.Union(e.u,e.v);//合并两个端点的集合(并查集union)
        }
        if(A.size()==G.V-1){
            break;
        }
    }
    return A;
}

int main(){
    vector<Edge>E;
    string line;
    cout<<"输入每个结点的邻居结点和通往邻居结点的边的权重"<<endl;
    int u=0;
    while(getline(cin,line)){
        if(line.empty()) break;
        stringstream ss(line);
        int v,weight;
        while(ss >>v>>weight){
            Edge e(u,v,weight);
            E.push_back(e);
        }
        u++;
    }
    Graph G(E,u+1);//u从0开始，一共有u+1个结点
    vector<Edge> MST=kruskal(G);
    for(Edge e:MST){
        e.display();
    }
}
```
另一个版本：
```cpp
#include<iostream>
#include<vector>
#include<algorithm>
using namespace std;
class disjoint_set_union{
public:
    vector<int>parent;
    vector<int>rank;
public:
    disjoint_set_union(int V):parent(V),rank(V,0){
        for(int i=0;i<V;i++){
            parent[i]=i;
        }
    }
    int find(int v){
        if(parent[v]!=v){
            parent[v]=find(parent[v]);
        }
        return parent[v];
    }
    void Union(int u,int v){
        int root_1=find(u);
        int root_2=find(v);
        if(root_1==root_2) return;
        else{
            if(rank[root_1]==rank[root_2]){
                rank[root_2]++;
                parent[root_1]=root_2;
            }
            else if(rank[root_1]>rank[root_2]){
                parent[root_2]=root_1;
            }
            else{
                parent[root_1]=root_2;
            }
        }
    }
};
class Edge{
public:
    int u;
    int v;
    int weight;
public:
    Edge(int u,int v,int w){
        this->u=u;
        this->v=v;
        this->weight=w;
    }
    bool operator<(const Edge&other) const{
        return weight<other.weight;
    }
};

int kruskal(vector<Edge> &edges,int V,bool & isConnected){//虽然一个函数只能有一个返回值，但可以通过引用传值再修改数据
    int sum_weight=0;
    int edges_used=0;
    disjoint_set_union forest(V+1);
    sort(edges.begin(),edges.end());
    for(Edge e:edges){
        if(forest.find(e.u)!=forest.find(e.v)){
            forest.Union(e.u,e.v);
            sum_weight+=e.weight;
            edges_used++;
            if(edges_used==V-1)break; 
        }
    }
    isConnected=(edges_used==V-1);//如果这个图中有不连通分量，isConnected就是false
    return sum_weight;
}
int main(){
    vector<Edge>edges;
    int V,E;
    cin>>V>>E;
    for (int i = 0; i < E; i++) {
        int u, v, weight;
        cin >> u >> v >> weight;
        edges.push_back(Edge(u, v, weight));
    }
    bool isConnected=false;
    int sum_weight=kruskal(edges,V,isConnected);
    if(isConnected){
    cout<<sum_weight;
    }
    else{
        cout<<"orz";
    }
}
```
#### 复杂度分析
第四行排序复杂度为 $O(E \log E)$（归并排序或者快速排序）。
第五到八行的执行 $O(E)$ 个 *find-set* 和 *union* 操作，与 $\lvert V \rvert$ 个 *make-set* 操作一起，总的运行时间为 $O((V+E)\alpha(V))$，$\alpha$ 是 21.4 节所定义的一个增长非常缓慢的函数。又因为 $G$ 是连通的，有 $\lvert E \rvert \geq \lvert V \rvert - 1$，所以时间复杂度可化简为 $O(V\alpha(V))$。又因为 $\alpha(\lvert V \rvert) = O(\log V) = O(\log E)$，与排序时间复杂度相加，总的时间复杂度为 $O(E \log E)$。
直观上理解的话，排序的时间开销是主导项
### Prim算法
*Prim*算法的工作原理与*Diskstra*最短路径算法相似。
集合 $A$ 中的边总是构成一棵树。算法每一步在连接 $A$ 和 $A$ 之外的结点的所有边中，选择一条轻量级边加入 $A$ 中。（你可以把单个结点看作一棵树，与 $A$ 相连依然满足定理23.2）
#### 伪代码
```text
mst_prim(G,w,r)
for each u:G.V
    u.key=infinite;
    u.parent=null;
r.key=0;
Q=G.V;
while !Q.empty():
    u=extract_min(Q)
    for each v:G.adj[u]
        if v in Q and w(u,v)<v.key
        v.parent=u;
        v.key=w(u,v);
```
#### C++实现
```cpp
#include<iostream>
#include<vector>
#include<sstream>
#include<queue>
#include<climits>
using namespace std;
class Graph{
public:
    vector<vector<pair<int,int>>> adj;//prim算法相对于每次选边的kruskal,它每次选择的是点，因此在建图的时候需要以点为中心，将key,parent,inMST视为点的属性
    int V;//结点数目
    vector<int> key;
    vector<bool>inMST;//先将树弱化为一个集合，集合中的元素相互连通
    vector<int>parent;//再根据到达树中结点路径的唯一性，只需记录父节点即可还原出整个树
public:
    Graph(const vector<vector<pair<int,int>>>& other):adj(other),V(adj.size()),key(V),inMST(V,false),parent(V,-1){
        for(int i=0;i<V;i++){
            key[i]=INT_MAX;
        }
    }
};
struct compare{
    bool operator()(const pair<int,int>& a,const pair<int,int>&b) const{
        return a.second >b.second;//辅助排序函数
    }
};
vector<int> mst_prim(Graph &G,int r){
    using P = pair<int, int>;
    priority_queue<P,vector<P>,compare>Q;//根据key排序，每次都选最小key的结点加入MST
    G.key[r]=0;
    Q.push({r,G.key[r]});//懒插入，每次只插入生成树中结点的邻居结点，这样就省去在初始化的时候多插入V-1个v_key==INT_MAX的无用pair。
    while(!Q.empty()){
        P min =Q.top();
        Q.pop();
        int u=min.first;
        int u_key=min.second;
        if(G.inMST[u]){
            continue;//无效pop,防止同一个结点被多次加入生成树
        }
        G.inMST[u]=true;
        for(const P &element:G.adj[u]){//很巧妙，不是对图进行扫描确定每个结点的key,而是在建树的时候思考相比上一次循环改变了什么，再对改变部分进行维护
            int v=element.first;
            int weight=element.second;
            if(!G.inMST[v]&&weight<G.key[v]){
                // 无需DECREASE-KEY:(先删除旧的，再插入新的),因为对于同一个结点key值更小的一定会被优先弹出,否则说明不满足!G.inMST[v]，虽然key值更小，但是破坏了树的性质
                G.key[v]=weight;
                G.parent[v]=u;//每个除了根结点外的结点都会更新parent,当有将生成树和v连接的权重更小的边时，parent[v]更新，代表一条更好通往v的路径
                Q.push({v,G.key[v]});//将此次更新结果重新加入队列，但这不代表v在下次循环就能被贪心算法选中作为生成树的一部分
            }
        }
    }
    return G.parent;
}
int main(){
    vector<vector<pair<int,int>>> adj;
    string line;
    cout<<"输入每个结点的邻居结点和通往邻居结点的边的权重"<<endl;
    int u=0;
    while(getline(cin,line)){
        if(line.empty()) break;
        vector<pair<int,int>>row;
        stringstream ss(line);
        int v,weight;
        while(ss >>v>>weight){
            pair<int,int> P={v,weight};
            row.push_back(P);
        }
        adj.push_back(row);
        u++;
    }
    Graph G(adj);
    vector<int> parent=mst_prim(G,0);
    for(int v=0;v<G.V;v++){
        int v_parent=parent[v];
        int weight=-1;
        if(v_parent!=-1){
            for(pair<int,int> edge:G.adj[v]){
                if(edge.first==v_parent){
                    weight=edge.second;
                    break;
                }
            }
        }
        cout <<v<<" --- "<<weight<<" --- "<<v_parent<< endl;
    }
```
另一个版本：
```cpp
#include<vector>
#include<iostream>
#include<queue>
#include<climits>
using namespace std;
struct Compare
{
    bool operator()(const pair<int,int>& p1,const pair<int,int>& p2){
        return p1.second>p2.second;
    }
};
int prim(vector<vector<pair<int,int>>> &adj,int r,int V){
    int sum=0;
    using P=pair<int,int>;
    vector<int>key(V+1,INT_MAX);
    vector<bool>inMST(V+1,false);
    vector<int>parent(V+1,-1);
    priority_queue<P,vector<P>,Compare> Q;
    key[r]=0;
    parent[r]=r;
    Q.push({r,0});
    while(!Q.empty()){
        P p=Q.top();
        Q.pop();
        int u=p.first;
        if(inMST[u]) continue;
        inMST[u]=true;
        sum+=p.second;
        for(P e:adj[u]){
            int v=e.first;
            int weight=e.second;
            if(!inMST[v]&&key[v]>weight){
                key[v]=weight;
                parent[v]=u;
                Q.push({v,key[v]});
            }
        }
    }
    return sum;
}
int main(){
    int V,E;
    cin>>V>>E;
    int u,v,w;
    vector<vector<pair<int,int>>> adj(V+1);
    for(int i=1;i<=E;i++){
        cin>>u>>v>>w;
        adj[u].push_back({v,w});
        adj[v].push_back({u,w});
    }
    int sum=prim(adj,1,V);
    cout<<sum<<endl;
}
```
#### 复杂度分析
对于我的实现：$G=(V,E)$
1. 初始化队列 $O(1)$
2. 队列 $Q$ 取出 $key$ 最小的结点，
每次操作：$O(\log size)$，$size\leq E$（最多 $E$ 条边），总 $ExtractMin$ 最多 $V$ 次（最小生成树最多只有 $V-1$ 条边），复杂度为 $O(V \log E)$
1. 对于每个新加入的结点，遍历临接结点一共 $O(E)$
2. $push$ 操作，最多 $E$ 次，单次时间复杂度 $O(\log size)$，$size\leq E$（最多 $E$ 条边），总复杂度 $O(E\log E)$
3. 所以时间复杂度为 $O((V+E)\log E)$，又因为 $\lvert E \rvert \geq \lvert V \rvert-1$，最后可以被化简为 $O(E\log E)$
#### prim算法应用:迷宫生成
将迷宫的每一个点视为结点，两点之间的墙代表一条边，如果没有墙则视为这条边被加入MST
和普通的prim大部份一样，只是在选择边的时候随机选择(只要不破坏树的性质就行)，因此也无需有key和weight
cpp逻辑实现:
```cpp
#include<iostream>
#include<vector>
#include<sstream>
#include <random>
#include <chrono>
using namespace std;
class Graph{
public:
    vector<vector<int>> adj;
    int V;
    vector<bool>inMST;
    vector<int>parent;
public:
    Graph(const vector<vector<int>>& other):adj(other),V(adj.size()),inMST(V,false),parent(V,-1){
    }
};
int pop_random(vector<int>& data) { 
    if (data.empty()) return -1;
    
    static mt19937 rng(chrono::steady_clock::now().time_since_epoch().count());
    uniform_int_distribution<int> dist(0, data.size() - 1);
    int index = dist(rng);
    
    int value = data[index];
    data[index] = data.back();
    data.pop_back();
    
    return value;
}
vector<int> mst_prim(Graph &G,int r){
    vector<int>Q;
    Q.push_back(r);
    while(!Q.empty()){
        int u=pop_random(Q);
        if(G.inMST[u]){
            continue;
        }
        G.inMST[u]=true;
        for(const int &v:G.adj[u]){
            if(!G.inMST[v]){
                G.parent[v]=u;
                Q.push_back(v);
            }
        }
    }
    return G.parent;
}
int main(){
    vector<vector<int>> adj;
    string line;
    cout<<"输入每个结点的邻居结点"<<endl;
    int u=0;
    while(getline(cin,line)){
        if(line.empty()) break;
        vector<int>row;
        stringstream ss(line);
        int v;
        while(ss >> v){
            row.push_back(v);
        }
        adj.push_back(row);
        u++;
    }
    Graph G(adj);
    vector<int> parent=mst_prim(G,0);
    for(int u=0;u<G.V;u++){
        int u_parent=parent[u];
        if(u_parent!=-1){
            cout <<u<<" ------ "<<u_parent<< endl;
        }
    }
}
```
vibe coding 制作的一个网页：
[迷宫生成可视化](http://tuchuang.brokenvase.top/picture/%E6%9C%AA%E5%91%BD%E5%90%8D.html)   
#### 最小生成树在图像分割/聚类上的应用
运用kruskal算法实现，但是每次选边的时候还要通过比较intensity_difference和weight的结果决定是否把边加入最小生成树，intensity_difference函数可以评估两个连通分量的差异度，避免将两个差异度过大的树（聚类）相连
```cpp
#include<iostream>
#include<vector>
#include<string>
#include<sstream>
#include<algorithm>
using namespace std;
class Edge{
public:
    int u;
    int v;
    int weight;
public:
    Edge(int u,int v,int w){
        this->u=u;
        this->v=v;
        weight=w;
    }
    bool operator<(const Edge&other) const{
        return weight<other.weight;
    }
    void show_connect(){
        cout<<u<<"---"<<weight<<"---"<<v<<endl;
    }
    void show_disconnect(){
        cout<<u<<"--X"<<"--"<<v<<endl;
    }
};
double intensity_difference(int max_weight_1,int size_1,int max_weight_2,int size_2,double k){
    return min(max_weight_1+k/size_1,max_weight_2+k/size_2);
}
/*
k/size在size较大时会变得比较小，说明能加入的边的weight需要偏小才能加入，说明当树的结点规模达到一定程度，加入的难度会提高，相对的，当树中只有一个结点时，虽然max_weight_1虽然小，但是k/size=k，提高了加入成功率
*/
class disjoint_set_uinion_for_segmentation{
public:
    int V;
    vector<int>parent;
    vector<int>rank;//把rank视为根结点的属性
    vector<int>max_weight;//把max_weight视为根结点的属性，记录连通分量内的最大边权值
    vector<int>size;//记录连通分量内的结点数
public:
    disjoint_set_uinion_for_segmentation(int V):V(V),parent(V),rank(V,0),max_weight(V,0),size(V,1){
        for(int i=0;i<V;i++){
            parent[i]=i;
        }
    }
    int find(int v){
        if(parent[v]!=v){
            parent[v]=find(parent[v]);
        }
        return parent[v];
    }
    bool Union(int u,int v,int weight){//如果weight小于intensity_difference,则真正上将两个连通分量相连，返回true，否则返回false
        int root_1=find(v);
        int root_2=find(u);
        if(root_1==root_2)return false;
        else{
            double diff=intensity_difference(max_weight[root_1],size[root_1],max_weight[root_2],size[root_2],100);
            if(rank[root_1]==rank[root_2]){
                if(diff>=weight){
                    parent[root_1]=root_2;
                    rank[root_2]++;
                    size[root_2]+=size[root_1];
                    if(max_weight[root_2]<weight){
                        max_weight[root_2]=weight;
                    }
                    return true;
                }
                return false;
            }
            else if(rank[root_1]>rank[root_2]){
                if(diff>=weight){
                    parent[root_2]=root_1;
                    size[root_1]+=size[root_2];
                    if(max_weight[root_1]<weight){
                        max_weight[root_1]=weight;
                    }
                    return true;
                }
                return false;
            }
            else {
                if(diff>=weight){
                    parent[root_1]=root_2;
                    size[root_2]+=size[root_1];
                    if(max_weight[root_2]<weight){
                        max_weight[root_2]=weight;
                    }
                    return true;
                }
                return false;
            }
        }
    }

};
class Graph{
public:
    vector<Edge>E;
    int V;
public:
    Graph(const vector<Edge> &other,int size):E(other),V(size){
    }
    void sort_by_weight(){
        sort(E.begin(),E.end());
    }
};
void kruskal_for_image_segmentation(Graph G,vector<Edge>& mergedEdges,vector<Edge>& boundaries){
    G.sort_by_weight();
    disjoint_set_uinion_for_segmentation forest(G.V);
    for(Edge e:G.E){
        if(forest.find(e.u)!=forest.find(e.v)){
            if(forest.Union(e.u,e.v,e.weight)){
                mergedEdges.push_back(e);
            }
            else{
                boundaries.push_back(e);
            }
        }
    }
}
int main(){
    vector<Edge>E;
    string line;
    cout<<"输入每个结点的邻居结点和通往邻居结点的边的权重"<<endl;
    int u=0;
    while(getline(cin,line)){
        if(line.empty()) break;
        stringstream ss(line);
        int v,weight;
        while(ss >>v>>weight){
            if(u<v){//避免重复添加边，注意只有kruskal才能这么干，如果换做是prim则可能会影响key值的更新
            Edge e(u,v,weight);
            E.push_back(e);
            }
        }
        u++;
    }
    Graph G(E,u+1);
    vector<Edge>mergedEdges;
    vector<Edge>boundaries;
    kruskal_for_image_segmentation(G,mergedEdges,boundaries);
    for(Edge e:mergedEdges){
        e.show_connect();
    }
    for(Edge e:boundaries){
        e.show_disconnect();
    }
}

```

#### $G$ 的最小生成树（MST）是唯一的。

**已知：** 图 $G$ 所有边权互不相同。  

---

##### 反证法证明

**假设结论不成立**，即存在两棵**不同的**最小生成树 $T_1$ 和 $T_2$，它们的边集不完全相同，但权值和相等（都是最小）。

---

##### 第一步：找到一条关键的边

既然 $T_1 \neq T_2$，那么一定存在某条边在 $T_1$ 中但不在 $T_2$ 中。  
**在这些"只属于其中一棵树"的边里，选权值最小的一条，记作 $e$。**

不妨设 $e \in T_1$ 但 $e \notin T_2$。

---

##### 第二步：将 $e$ 加入 $T_2$ 中

$T_2$ 原本是一棵树，加入 $e$ 后会恰好形成一个**环**，记作 $C$。

这个环 $C$ 上一定有**至少一条边**不在 $T_1$ 中——因为如果环上所有边都在 $T_1$ 中，那么 $T_1$ 中就包含环，与"树无环"矛盾。

---

##### 第三步：环上找到一条不在 $T_1$ 中的边

在环 $C$ 上，取一条**不在 $T_1$ 中**的边，记作 $f$。  
那么 $f \in T_2$ 但 $f \notin T_1$。

---

##### 第四步：比较 $e$ 和 $f$ 的权值

回顾我们第一步的选取规则：  
$e$ 是所有"只在其中一棵树中"的边里**权值最小**的那条。

现在 $f$ 也是"只在其中一棵树中"的边，$f$ 在 $T_2$ 但不在 $T_1$，根据选取规则：
$$w(e) \leq w(f)$$
但由于题目假设**所有边权互不相同**，所以：
$$w(e) < w(f)$$
（等号不可能成立）

---

##### 第五步：构造一棵更小的生成树，推出矛盾

现在我们从 $T_2$ 中做一次边替换：
$$T' = T_2 - \{f\} \cup \{e\}$$
$T'$ 仍然是生成树（因为 $f$ 在环 $C$ 上，去掉环上一条边再加入 $e$ 后，既无环又连通）。
- 权值和变化：
$$w(T') = w(T_2) - w(f) + w(e) < w(T_2)$$
（因为 $w(e) < w(f)$）

这意味着我们找到了比 $T_2$ 权值更小的生成树。  
但 $T_2$ 本来是最小生成树，权值已经是最小的了——**矛盾**。
#### 次小生成树
结论：
如果 T 是最小生成树，T' 是次小生成树，那么 T' 可以通过"从 T 中删掉一条边，再加入一条边"得到。
换句话说：**次小生成树和MST只差一条边**
##### 核心思路
次小生成树的经典求法：
1. 先求出最小生成树（MST），记录哪些边被选中
2. 枚举每条不在 MST 中的边，尝试加入
3. 加入后会形成环，删除环上权重最大的 MST 边
4. 取所有可能中新权重和最小的那个
**对于具体实现的话可以有：**
求次小生成树三步走：
1. 用 Kruskal 求出 MST
2. 遍历非树边，每条都"强行加入"
3. 然后用 Kruskal 思想补全剩下的边
4. 取所有合法方案中权值最小的
**为什么这样的思路也是正确的？**
1. 次小生成树与MST只差一条边（定理保证）
2. 所以只需枚举"换哪条非MST边"
3. 强制加入非MST边 + Kruskal补全 = 模拟"换边"
4. Kruskal自动处理了"该删哪条MST边"（形成环时跳过）
kruskal不会选择权重最大的MST边（贪心性质），所以相当于删除了环上权重最大的 MST边
##### CPP实现
```cpp
#include<iostream>
#include<vector>
#include<algorithm>
#include<climits>
using namespace std;

class Edge{
public:
    int u, v, weight;
    bool inMST;  // 标记：这条边在MST中吗？
    
    Edge(int u, int v, int w): u(u), v(v), weight(w), inMST(false) {}
    
    bool operator<(const Edge& other) const {
        return weight < other.weight;
    }
};

class disjoint_set_union{
public:
    vector<int> parent;
    vector<int> rank;
    
    disjoint_set_union(int V): rank(V+1, 1){
        parent.resize(V+1);
        for(int i=1; i<V+1; i++){
            parent[i] = i;
        }
    }
    
    int Find(int u){
        if(parent[u] != u){
            parent[u] = Find(parent[u]);
        }
        return parent[u];
    }
    
    void Union(int u, int v){
        int root1 = Find(u);
        int root2 = Find(v);
        if(root1 == root2) return;
        if(rank[root1] <= rank[root2]){
            parent[root1] = root2;
            rank[root2] += rank[root1];
        }
        else{
            parent[root2] = root1;
            rank[root1] += rank[root2];
        }
    }
};

int main(){
    int V, E;
    cin >> V >> E;
    vector<Edge> edges;
    
    // 读入所有边
    for(int i=1; i<=E; i++){
        int u, v, w;
        cin >> u >> v >> w;
        edges.push_back(Edge(u, v, w));
    }
    
    // ============ 第一步：求MST============
    sort(edges.begin(), edges.end());
    disjoint_set_union dsu(V);
    
    int mstWeight = 0;
    int edgeCount = 0;
    
    // 记录MST用了哪些边
    vector<int> mstEdges;  // 存储MST中边的索引
    
    for(int i=0; i<edges.size(); i++){
        Edge& e = edges[i];
        if(dsu.Find(e.u) != dsu.Find(e.v)){
            mstWeight += e.weight;
            dsu.Union(e.u, e.v);
            edgeCount++;
            e.inMST = true;          // 标记为MST边
            mstEdges.push_back(i);   // 记录这条边
        }
        if(edgeCount == V-1) break;
    }
    
    cout << "MST weight: " << mstWeight << endl;
    
    // ============ 第二步：求次小生成树 ============
    int secondMin = INT_MAX;
    
    // 遍历每条【不在MST中】的边
    for(int i=0; i<edges.size(); i++){
        if(edges[i].inMST) continue;  // 跳过MST中的边
        
        // 尝试加入这条非树边
        Edge newEdge = edges[i];
        
        // 重新构建MST，但必须包含 newEdge
        disjoint_set_union newDsu(V);
        int newWeight = newEdge.weight;
        newDsu.Union(newEdge.u, newEdge.v);  // 先加入非树边
        
        int count = 1;  // 已经有一条边了
        
        // 然后加入其他最小的边（但要跳过会形成环的）
        for(int j=0; j<edges.size() && count<V-1; j++){
            if(j == i) continue;  // 跳过正在尝试的非树边
            
            Edge& e = edges[j];
            if(newDsu.Find(e.u) != newDsu.Find(e.v)){
                newWeight += e.weight;
                newDsu.Union(e.u, e.v);
                count++;
            }
        }
        
        // 如果成功构成生成树，且权重严格大于MST
        if(count == V-1 && newWeight > mstWeight){
            if(newWeight < secondMin){
                secondMin = newWeight;
            }
        }
    }
    
    if(secondMin == INT_MAX){
        cout << -1 << endl;
    } else {
        cout << "Second MST weight: " << secondMin << endl;
    }
    
    return 0;
}
```



