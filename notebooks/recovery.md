These notebooks estimate $p_{\text{intention}}$ and $p_{\text{recall}}$ **directly as free statistical parameters** from participant-level AX-CPT summary data.

These notebooks should be understood as **measurement-model** analyses, not full mechanistic process-model fits.

They estimate the effective rates of intention and recall engagement under a chosen branching structure. The resulting values are therefore **model-dependent**: $p_{\text{intention}}$ and $p_{\text{recall}}$ are interpretable only within the structural form under which they were estimated.

This differs from the original MATLAB **process-model** scripts, where $p_{\text{intention}}$ and $p_{\text{recall}}$ are not fit directly. In those scripts, they are **derived outputs** of a mechanistic model in which control engagement depends on latent rewards, costs, and task conditions (for example, $\alpha$, $\delta_t$, and $\lambda$). Here, that mechanistic layer is intentionally set aside. The notebooks focus on estimating **how often** intention and recall appear to be used, not **why** they arise from a particular utility computation.

## Model form

The notebooks retain the same **branching logic** as the candidate model forms, but treat the latent probabilities themselves as the unknowns.

For the **RecallOverride** structure, predicted accuracy on a trial type is written as

$$
P(\text{Correct})
=
p_{\text{recall}} \, Acc_{\text{recall}}
+
(1-p_{\text{recall}})
\Big[
p_{\text{intention}} \, Acc_{\text{proactive}}
+
(1-p_{\text{intention}})\, Acc_{\text{habitual}}
\Big].
$$

For the **NoInhibition** structure, predicted accuracy is written as

$$
P(\text{Correct})
=
p_{\text{intention}} \, Acc_{\text{proactive}}
+
(1-p_{\text{intention}})
\Big[
p_{\text{recall}} \, Acc_{\text{recall}}
+
(1-p_{\text{recall}})\, Acc_{\text{habitual}}
\Big].
$$

In these equations:

- $Acc_{\text{recall}}$
- $Acc_{\text{proactive}}$
- $Acc_{\text{habitual}}$

are treated as fixed quantities determined by the task structure and the model assumptions. This leaves:

- $p_{\text{intention}}$
- $p_{\text{recall}}$

as the only free parameters.

## Model constants

The measurement-models use three fixed component accuracies for each trial type:
- habitual accuracy, $Acc_{\text{hab}}$
- proactive accuracy, $Acc_{\text{pro}}$
- recall accuracy, $Acc_{\text{rec}}$

### Habitual accuracy $Acc_{\text{hab}}$

This is the default accuracy if no control is engaged.

For X-probe trials (AX, BX), habitual accuracy follows the marginal frequency of AX relative to all X-probe trials:

$$
Acc_{\text{hab}}(AX)=\frac{pAX}{pAX+pBX}, \qquad
Acc_{\text{hab}}(BX)=\frac{pBX}{pAX+pBX}.
$$

Under the standard 70/10/10/10 design:

$$
\frac{0.7}{0.7+0.1}=0.875, \qquad
\frac{0.1}{0.7+0.1}=0.125.
$$

For Y-probe trials (AY, BY), habitual accuracy is fixed at:

$$
Acc_{\text{hab}}(AY)=1, \qquad Acc_{\text{hab}}(BY)=1.
$$

### Proactive accuracy $Acc_{\text{pro}}$

This is the accuracy obtained when the participant relies entirely on the cue.

For A-cue trials (AX, AY), proactive accuracy depends on how strongly an A cue predicts X:

$$
Acc_{\text{pro}}(AX)=\frac{pAX}{pAX+pAY}, \qquad
Acc_{\text{pro}}(AY)=1-\frac{pAX}{pAX+pAY}.
$$

Under the 70/10/10/10 design:

$$
\frac{0.7}{0.7+0.1}=0.875, \qquad
1-0.875=0.125.
$$

For B-cue trials (BX, BY), proactive accuracy is fixed at:

$$
Acc_{\text{pro}}(BX)=1, \qquad Acc_{\text{pro}}(BY)=1.
$$

### Recall accuracy $Acc_{\text{rec}}$

This is the accuracy obtained if the participant successfully recalls the cue-probe association from memory.

Recall accuracy is set uniformly across all trial types:

$$
Acc_{\text{rec}} = 1.
$$

This follows from the current fixed settings:
- memory strength $m = 1$
- cognitive-load interference $\lambda = 0$
- load $= 1$

### Slip adjustment

After the base component accuracies are computed, a slip adjustment is applied to account for random response errors or lapses of attention:

$$
Acc_{\text{final}}

Acc_{\text{base}}(1-p_{\text{slip}})
+
(1-Acc_{\text{base}})p_{\text{slip}}.
$$

The slip rate $p_{\text{slip}}$ is fixed once for the sample and is estimated from the mean BY error rate, since BY is treated as the easiest trial type.

## Estimation method

The notebooks use **maximum likelihood estimation (MLE)** to fit these two probabilities directly.

For each participant, the observed data are the filtered AX / AY / BX / BY trial counts and the corresponding numbers correct. Given a candidate pair of values for $p_{\text{intention}}$ and $p_{\text{recall}}$, the notebook:

1. computes the predicted AX / AY / BX / BY accuracies from the chosen model form,
2. compares those predicted accuracies to the participant’s observed correct counts,
3. evaluates the fit using a **binomial log-likelihood**,
4. updates the parameter values to maximize that likelihood.

So the optimizer is not fitting latent utility parameters such as $\alpha$ or $\delta_t$. It is fitting the probabilities themselves.

## Parameter bounds

Since $p_{\text{intention}}$ and $p_{\text{recall}}$ are probabilities, both are constrained to lie in

$$
[0,1].
$$

This means the optimizer searches directly over admissible probability values. Unlike the process-model scripts, there is no need to infer probabilities indirectly from fitted reward or cost parameters.

## Purpose of recoverability analyses

The recoverability analyses ask whether these two latent probabilities can be estimated reliably from the available participant-level AX-CPT summary data.

At each chosen pair of true values,

$$
\left(p_{\text{intention}}^{\text{true}},\; p_{\text{recall}}^{\text{true}}\right),
$$

1. generate synthetic correct counts using the participant’s real filtered trial counts,
2. refit the same measurement model,
3. compare the recovered estimates to the known generating values.

Then assess:

- correlation between true and recovered values,
- bias,
- RMSE,
- and boundary-collapse behavior.

