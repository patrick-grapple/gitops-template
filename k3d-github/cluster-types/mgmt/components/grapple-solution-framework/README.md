
--------------

k create ns grpl-system

sed 's,<CLUSTER_NAME>,grpl-kubefirst,g' /Users/patrickriegler/code/grapple/kubefirst-gitops-catalog/grapple-solution-framework/components/grapple-solution-framework/clusterolebinding.yaml | kubectl apply -n grpl-system -f -

kubectl apply -n grpl-system -f - <<EOF      
---
kind: ConfigMap
apiVersion: v1
metadata:
  name: grapple-install-cm
  annotations:
    argocd.argoproj.io/sync-wave: "0"
data:
  TARGET_PLATFORM: "Kubefirst"
  GRAPPLE_DNS: "kubefirst.grapple-demo.com"
  GRAPPLE_VERSION: "0.2.8"
  AUTO_CONFIRM: "true"
  ORGANIZATION: "grapple-solution"
  GITHUB_USERNAME: "patrick-grapple"
  GITLAB_USERNAME: ""
  # EMAIL: "patrick.riegler@grapple-solutions.com"
  KUBEFIRST_CLOUD_PROVIDER: "Civo"
  KUBEFIRST_CLOUD_REGION: "fra1"
  KUBEFIRST_CLUSTER_NAME: "grpl-kubefirst"
  KUBEFIRST_CLUSTER_ID: "96e2e337-2048-4a50-81f2-11facacc9145"
EOF

sed 's,<CLUSTER_NAME>,grpl-kubefirst,g' /Users/patrickriegler/code/grapple/kubefirst-gitops-catalog/grapple-solution-framework/components/grapple-solution-framework/application.yaml | sed 's,<PROJECT>,default,g' | sed 's,<CLUSTER_DESTINATION>,in-cluster,g' | kubectl apply -n argocd -f -


cd "/System/Volumes/Data/Users/patrickriegler/Library/Application Support/mkcert/" && \
  kubectl create secret generic mkcert-ca-secret \
    --from-file=ca.crt=rootCA.pem \
    --from-file=ca.key=rootCA-key.pem \
    --namespace grpl-system && \
  cd -


# --- k3d

kubectl apply -n grpl-system -f - <<EOF      
---
kind: ConfigMap
apiVersion: v1
metadata:
  name: grapple-install-cm
  annotations:
    argocd.argoproj.io/sync-wave: "0"
data:
  TARGET_PLATFORM: "Kubefirst"
  GRAPPLE_DNS: "kubefirst.dev"
  GRAPPLE_VERSION: "0.2.8"
  AUTO_CONFIRM: "true"
  ORGANIZATION: "grapple-solution"
  GITHUB_USERNAME: "patrick-grapple"
  GITLAB_USERNAME: ""
  # EMAIL: "patrick.riegler@grapple-solutions.com"
  KUBEFIRST_CLOUD_PROVIDER: "k3d"
  KUBEFIRST_CLOUD_REGION: "local"
  KUBEFIRST_CLUSTER_NAME: "grpl-kubefirst"
  KUBEFIRST_CLUSTER_ID: "96e2e337-2048-4a50-81f2-11facacc9145"
EOF


kubectl apply -n grpl-system -f - <<EOF      
kind: Service
apiVersion: v1
metadata:
 name: argo-on-the-host
spec:
 type: ExternalName
 externalName: argocd.kubefirst.dev
EOF